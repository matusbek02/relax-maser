CREATE TYPE public.app_role AS ENUM ('admin','user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own roles readable" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE TYPE public.booking_status AS ENUM ('pending','confirmed','cancelled');

CREATE TABLE public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service text NOT NULL,
  duration_min integer NOT NULL,
  starts_at timestamptz NOT NULL,
  ends_at timestamptz NOT NULL,
  customer_name text NOT NULL,
  phone text NOT NULL,
  email text,
  note text,
  status public.booking_status NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX bookings_starts_at_idx ON public.bookings (starts_at);

GRANT INSERT ON public.bookings TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.bookings TO authenticated;
GRANT ALL ON public.bookings TO service_role;

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone can request a booking" ON public.bookings
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    status = 'pending'
    AND starts_at > now()
    AND ends_at > starts_at
    AND duration_min BETWEEN 15 AND 240
    AND length(customer_name) BETWEEN 2 AND 100
    AND length(phone) BETWEEN 6 AND 30
    AND length(service) BETWEEN 2 AND 100
    AND (note IS NULL OR length(note) <= 1000)
    AND (email IS NULL OR length(email) <= 200)
  );

CREATE POLICY "admins read bookings" ON public.bookings
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins update bookings" ON public.bookings
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins delete bookings" ON public.bookings
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.get_busy_slots(_from timestamptz, _to timestamptz)
RETURNS TABLE (starts_at timestamptz, ends_at timestamptz)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT b.starts_at, b.ends_at
  FROM public.bookings b
  WHERE b.status <> 'cancelled'
    AND b.starts_at < _to
    AND b.ends_at > _from
  ORDER BY b.starts_at
$$;

GRANT EXECUTE ON FUNCTION public.get_busy_slots(timestamptz, timestamptz) TO anon, authenticated;