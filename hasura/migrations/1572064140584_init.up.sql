SET xmloption = content;
CREATE FUNCTION public.set_current_timestamp_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  _new record;
BEGIN
  _new := NEW;
  _new."updated_at" = NOW();
  RETURN _new;
END;
$$;
CREATE TABLE public.body_numbers (
    number text NOT NULL,
    notes text,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);
CREATE TABLE public.case_numbers (
    number text NOT NULL,
    expired_at date NOT NULL,
    notes text,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);
CREATE TABLE public.companies (
    id integer NOT NULL,
    name text NOT NULL,
    address text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);
CREATE SEQUENCE public.companies_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.companies_id_seq OWNED BY public.companies.id;
CREATE TABLE public.drivers (
    id integer NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    license_number text NOT NULL,
    address text NOT NULL,
    contact_number text,
    updated_at timestamp without time zone DEFAULT now()
);
CREATE SEQUENCE public.driver_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.driver_id_seq OWNED BY public.drivers.id;
CREATE TABLE public.drop_units (
    id integer NOT NULL
);
COMMENT ON TABLE public.drop_units IS 'Drop vehicles';
CREATE SEQUENCE public.drop_units_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.drop_units_id_seq OWNED BY public.drop_units.id;
CREATE TABLE public.garages (
    id integer NOT NULL,
    name text NOT NULL,
    address text,
    notes text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now()
);
CREATE SEQUENCE public.garages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.garages_id_seq OWNED BY public.garages.id;
CREATE TABLE public.migrations (
    id integer NOT NULL,
    migration character varying(255) NOT NULL,
    batch integer NOT NULL
);
CREATE SEQUENCE public.migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.migrations_id_seq OWNED BY public.migrations.id;
CREATE TABLE public.parts (
    id integer NOT NULL,
    name text NOT NULL,
    code text NOT NULL,
    quantity integer DEFAULT 0 NOT NULL,
    description text,
    created_at date DEFAULT now() NOT NULL,
    updated_at date DEFAULT now() NOT NULL
);
CREATE SEQUENCE public.parts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.parts_id_seq OWNED BY public.parts.id;
CREATE TABLE public.rentals (
    id integer NOT NULL,
    driver_id integer NOT NULL,
    taxi_id integer NOT NULL,
    status text NOT NULL,
    rental_start_date date DEFAULT now() NOT NULL,
    rental_end_date date DEFAULT now()
);
CREATE SEQUENCE public.rental_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.rental_id_seq OWNED BY public.rentals.id;
CREATE TABLE public.series (
    name text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    id integer NOT NULL,
    notes text
);
CREATE SEQUENCE public.series_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.series_id_seq OWNED BY public.series.id;
CREATE TABLE public.sold_units (
    id integer NOT NULL
);
CREATE SEQUENCE public.sold_units_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.sold_units_id_seq OWNED BY public.sold_units.id;
CREATE TABLE public.taxis (
    id integer NOT NULL,
    plate_number text NOT NULL,
    notes text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    status text DEFAULT 'operable'::text,
    body_number text NOT NULL,
    engine_number text NOT NULL,
    chassis_number text NOT NULL,
    cr_number text NOT NULL,
    cr_issued_at date DEFAULT now() NOT NULL,
    year_model text NOT NULL,
    mv_file_number text NOT NULL,
    private_number text NOT NULL,
    sticker text NOT NULL,
    acquired_at date DEFAULT now() NOT NULL,
    temporary_plate_number text,
    or_number text NOT NULL,
    or_issued_at date DEFAULT now() NOT NULL,
    case_number text NOT NULL,
    garage_id integer NOT NULL,
    company_id integer NOT NULL,
    series_id integer
);
COMMENT ON COLUMN public.taxis.cr_number IS 'certificate of registration';
COMMENT ON COLUMN public.taxis.cr_issued_at IS 'certificate of registration date';
CREATE SEQUENCE public.taxi_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.taxi_id_seq OWNED BY public.taxis.id;
CREATE TABLE public.users (
    id bigint NOT NULL,
    first_name character varying(255) NOT NULL,
    last_name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    deleted_at timestamp(0) without time zone
);
CREATE SEQUENCE public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;
CREATE TABLE public.year_models (
    name text NOT NULL,
    notes text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);
ALTER TABLE ONLY public.companies ALTER COLUMN id SET DEFAULT nextval('public.companies_id_seq'::regclass);
ALTER TABLE ONLY public.drivers ALTER COLUMN id SET DEFAULT nextval('public.driver_id_seq'::regclass);
ALTER TABLE ONLY public.drop_units ALTER COLUMN id SET DEFAULT nextval('public.drop_units_id_seq'::regclass);
ALTER TABLE ONLY public.garages ALTER COLUMN id SET DEFAULT nextval('public.garages_id_seq'::regclass);
ALTER TABLE ONLY public.migrations ALTER COLUMN id SET DEFAULT nextval('public.migrations_id_seq'::regclass);
ALTER TABLE ONLY public.parts ALTER COLUMN id SET DEFAULT nextval('public.parts_id_seq'::regclass);
ALTER TABLE ONLY public.rentals ALTER COLUMN id SET DEFAULT nextval('public.rental_id_seq'::regclass);
ALTER TABLE ONLY public.series ALTER COLUMN id SET DEFAULT nextval('public.series_id_seq'::regclass);
ALTER TABLE ONLY public.sold_units ALTER COLUMN id SET DEFAULT nextval('public.sold_units_id_seq'::regclass);
ALTER TABLE ONLY public.taxis ALTER COLUMN id SET DEFAULT nextval('public.taxi_id_seq'::regclass);
ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);
ALTER TABLE ONLY public.body_numbers
    ADD CONSTRAINT body_numbers_pkey PRIMARY KEY (number);
ALTER TABLE ONLY public.case_numbers
    ADD CONSTRAINT cases_number_key UNIQUE (number);
ALTER TABLE ONLY public.case_numbers
    ADD CONSTRAINT cases_pkey PRIMARY KEY (number);
ALTER TABLE ONLY public.companies
    ADD CONSTRAINT companies_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.drivers
    ADD CONSTRAINT driver_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.drop_units
    ADD CONSTRAINT drop_units_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.garages
    ADD CONSTRAINT garages_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.parts
    ADD CONSTRAINT parts_code_key UNIQUE (code);
ALTER TABLE ONLY public.parts
    ADD CONSTRAINT parts_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.rentals
    ADD CONSTRAINT rental_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.series
    ADD CONSTRAINT series_id_key UNIQUE (id);
ALTER TABLE ONLY public.series
    ADD CONSTRAINT series_name_key UNIQUE (name);
ALTER TABLE ONLY public.series
    ADD CONSTRAINT series_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.sold_units
    ADD CONSTRAINT sold_units_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.taxis
    ADD CONSTRAINT taxi_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.taxis
    ADD CONSTRAINT taxi_plate_number_key UNIQUE (plate_number);
ALTER TABLE ONLY public.taxis
    ADD CONSTRAINT taxis_body_number_key UNIQUE (body_number);
ALTER TABLE ONLY public.taxis
    ADD CONSTRAINT taxis_chassis_number_key UNIQUE (chassis_number);
ALTER TABLE ONLY public.taxis
    ADD CONSTRAINT taxis_engine_number_key UNIQUE (engine_number);
ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_unique UNIQUE (email);
ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.year_models
    ADD CONSTRAINT year_models_pkey PRIMARY KEY (name);
CREATE TRIGGER set_public_garages_updated_at BEFORE UPDATE ON public.garages FOR EACH ROW EXECUTE PROCEDURE public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_garages_updated_at ON public.garages IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_year_models_updated_at BEFORE UPDATE ON public.year_models FOR EACH ROW EXECUTE PROCEDURE public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_year_models_updated_at ON public.year_models IS 'trigger to set value of column "updated_at" to current timestamp on row update';
ALTER TABLE ONLY public.taxis
    ADD CONSTRAINT taxis_body_number_fkey FOREIGN KEY (body_number) REFERENCES public.body_numbers(number) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE ONLY public.taxis
    ADD CONSTRAINT taxis_case_number_fkey FOREIGN KEY (case_number) REFERENCES public.case_numbers(number) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE ONLY public.taxis
    ADD CONSTRAINT taxis_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE ONLY public.taxis
    ADD CONSTRAINT taxis_garage_id_fkey FOREIGN KEY (garage_id) REFERENCES public.garages(id) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE ONLY public.taxis
    ADD CONSTRAINT taxis_series_id_fkey FOREIGN KEY (series_id) REFERENCES public.series(id) ON UPDATE CASCADE ON DELETE RESTRICT;
