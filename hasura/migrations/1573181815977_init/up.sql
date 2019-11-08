SET xmloption = content;
CREATE TYPE public.body_number_status AS ENUM (
    'assigned',
    'unassigned'
);
CREATE TYPE public.civil_status AS ENUM (
    'single',
    'married'
);
CREATE TYPE public.dispatch_status AS ENUM (
    'run',
    'drop',
    'standby'
);
CREATE TYPE public.employment_status AS ENUM (
    'active',
    'resigned',
    're-apply',
    'awol'
);
CREATE TYPE public.gender AS ENUM (
    'male',
    'female'
);
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
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    status public.body_number_status
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
    city_address text NOT NULL,
    updated_at timestamp without time zone DEFAULT now(),
    driver_number integer,
    middle_name text,
    telephone_number text,
    provincial_address text,
    email_address text,
    birthdate date,
    birthplace text,
    height text,
    weight text,
    religion text,
    civil_status public.civil_status DEFAULT 'single'::public.civil_status,
    citizenship text,
    gender public.gender DEFAULT 'male'::public.gender,
    spouse_name text,
    spouse_address text,
    occupation text,
    father_name text,
    father_occupation text,
    mother_name text,
    mother_occupation text,
    parent_address text,
    parent_tel_number text,
    language text,
    notes text
);
CREATE SEQUENCE public.driver_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.driver_id_seq OWNED BY public.drivers.id;
CREATE TABLE public.drivers_character_reference (
    name text NOT NULL,
    address text NOT NULL,
    "position" text NOT NULL,
    telephone_number text NOT NULL,
    id integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    driver_id integer
);
CREATE SEQUENCE public.drivers_character_referrence_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.drivers_character_referrence_id_seq OWNED BY public.drivers_character_reference.id;
CREATE TABLE public.drivers_educational_attainment (
    primary_school_name text NOT NULL,
    primary_degree text NOT NULL,
    primary_year_attended text NOT NULL,
    vocational_school_name text NOT NULL,
    vocational_degree text NOT NULL,
    vocational_year_attended text NOT NULL,
    secondary_school_name text NOT NULL,
    secondary_degree text NOT NULL,
    secondary_year_attended text NOT NULL,
    tertiary_school_name text NOT NULL,
    tertiary_degree text NOT NULL,
    tertiary_year_attended text NOT NULL,
    course text NOT NULL,
    special_skills text NOT NULL,
    others text NOT NULL,
    id integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    driver_id integer
);
CREATE SEQUENCE public.drivers_educational_attainment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.drivers_educational_attainment_id_seq OWNED BY public.drivers_educational_attainment.id;
CREATE TABLE public.drivers_employment_history (
    id integer NOT NULL,
    company_name text NOT NULL,
    "position" text NOT NULL,
    start_date text NOT NULL,
    end_date text NOT NULL,
    driver_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);
CREATE SEQUENCE public.drivers_employment_history_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.drivers_employment_history_id_seq OWNED BY public.drivers_employment_history.id;
CREATE TABLE public.drivers_other_info (
    id integer NOT NULL,
    employment_status public.employment_status DEFAULT 'active'::public.employment_status NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    driver_id integer
);
CREATE SEQUENCE public.drivers_other_info_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.drivers_other_info_id_seq OWNED BY public.drivers_other_info.id;
CREATE TABLE public.drop_units (
    plate_number text,
    notes text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    status text,
    body_number text,
    engine_number text,
    chassis_number text,
    cr_number text,
    cr_issued_at date,
    year_model text,
    mv_file_number text,
    private_number text,
    sticker text,
    acquired_at date,
    temporary_plate_number text,
    or_number text,
    or_issued_at date,
    case_number text,
    series_id integer,
    id integer NOT NULL
);
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
    series_id integer,
    dispatch_status public.dispatch_status DEFAULT 'run'::public.dispatch_status NOT NULL
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
    id integer NOT NULL,
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
ALTER TABLE ONLY public.drivers_character_reference ALTER COLUMN id SET DEFAULT nextval('public.drivers_character_referrence_id_seq'::regclass);
ALTER TABLE ONLY public.drivers_educational_attainment ALTER COLUMN id SET DEFAULT nextval('public.drivers_educational_attainment_id_seq'::regclass);
ALTER TABLE ONLY public.drivers_employment_history ALTER COLUMN id SET DEFAULT nextval('public.drivers_employment_history_id_seq'::regclass);
ALTER TABLE ONLY public.drivers_other_info ALTER COLUMN id SET DEFAULT nextval('public.drivers_other_info_id_seq'::regclass);
ALTER TABLE ONLY public.drop_units ALTER COLUMN id SET DEFAULT nextval('public.drop_units_id_seq'::regclass);
ALTER TABLE ONLY public.garages ALTER COLUMN id SET DEFAULT nextval('public.garages_id_seq'::regclass);
ALTER TABLE ONLY public.migrations ALTER COLUMN id SET DEFAULT nextval('public.migrations_id_seq'::regclass);
ALTER TABLE ONLY public.parts ALTER COLUMN id SET DEFAULT nextval('public.parts_id_seq'::regclass);
ALTER TABLE ONLY public.rentals ALTER COLUMN id SET DEFAULT nextval('public.rental_id_seq'::regclass);
ALTER TABLE ONLY public.series ALTER COLUMN id SET DEFAULT nextval('public.series_id_seq'::regclass);
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
ALTER TABLE ONLY public.drivers_character_reference
    ADD CONSTRAINT drivers_character_referrence_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.drivers_educational_attainment
    ADD CONSTRAINT drivers_educational_attainment_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.drivers_employment_history
    ADD CONSTRAINT drivers_employment_history_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.drivers_other_info
    ADD CONSTRAINT drivers_other_info_pkey PRIMARY KEY (id);
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
    ADD CONSTRAINT users_id_key UNIQUE (id);
ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.year_models
    ADD CONSTRAINT year_models_pkey PRIMARY KEY (name);
CREATE TRIGGER set_public_drivers_character_referrence_updated_at BEFORE UPDATE ON public.drivers_character_reference FOR EACH ROW EXECUTE PROCEDURE public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_drivers_character_referrence_updated_at ON public.drivers_character_reference IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_drivers_educational_attainment_updated_at BEFORE UPDATE ON public.drivers_educational_attainment FOR EACH ROW EXECUTE PROCEDURE public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_drivers_educational_attainment_updated_at ON public.drivers_educational_attainment IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_drivers_employment_history_updated_at BEFORE UPDATE ON public.drivers_employment_history FOR EACH ROW EXECUTE PROCEDURE public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_drivers_employment_history_updated_at ON public.drivers_employment_history IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_drivers_other_info_updated_at BEFORE UPDATE ON public.drivers_other_info FOR EACH ROW EXECUTE PROCEDURE public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_drivers_other_info_updated_at ON public.drivers_other_info IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_garages_updated_at BEFORE UPDATE ON public.garages FOR EACH ROW EXECUTE PROCEDURE public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_garages_updated_at ON public.garages IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_year_models_updated_at BEFORE UPDATE ON public.year_models FOR EACH ROW EXECUTE PROCEDURE public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_year_models_updated_at ON public.year_models IS 'trigger to set value of column "updated_at" to current timestamp on row update';
ALTER TABLE ONLY public.drivers_character_reference
    ADD CONSTRAINT drivers_character_reference_driver_id_fkey FOREIGN KEY (driver_id) REFERENCES public.drivers(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.drivers_educational_attainment
    ADD CONSTRAINT drivers_educational_attainment_driver_id_fkey FOREIGN KEY (driver_id) REFERENCES public.drivers(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.drivers_employment_history
    ADD CONSTRAINT drivers_employment_history_driver_id_fkey FOREIGN KEY (driver_id) REFERENCES public.drivers(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.drivers_other_info
    ADD CONSTRAINT drivers_other_info_driver_id_fkey FOREIGN KEY (driver_id) REFERENCES public.drivers(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.drop_units
    ADD CONSTRAINT drop_units_series_id_fkey FOREIGN KEY (series_id) REFERENCES public.series(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.taxis
    ADD CONSTRAINT taxis_body_number_fkey FOREIGN KEY (body_number) REFERENCES public.body_numbers(number) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.taxis
    ADD CONSTRAINT taxis_case_number_fkey FOREIGN KEY (case_number) REFERENCES public.case_numbers(number) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE ONLY public.taxis
    ADD CONSTRAINT taxis_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE ONLY public.taxis
    ADD CONSTRAINT taxis_garage_id_fkey FOREIGN KEY (garage_id) REFERENCES public.garages(id) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE ONLY public.taxis
    ADD CONSTRAINT taxis_series_id_fkey FOREIGN KEY (series_id) REFERENCES public.series(id) ON UPDATE CASCADE ON DELETE RESTRICT;
