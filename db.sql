CREATE TABLE nichos (
    nicho     VARCHAR(12) NOT NULL,
    json      VARCHAR(64),
    resumen   VARCHAR(40)
);
ALTER TABLE nichos ADD CONSTRAINT nichos_pk PRIMARY KEY ( nicho );

ALTER TABLE campaign
    ADD CHECK ( tipo IN (
        'Uni',
        'Mass'
    ) );

CREATE TABLE telefonos (
    numero      VARCHAR(10),
    company     VARCHAR(16),
    serie_sim   VARCHAR(20)
);

ALTER TABLE telefonos
    ADD CHECK ( company IN (
        'AT&T',
        'Movistar',
        'Otro',
        'Telcel'
    ) );

ALTER TABLE telefonos ADD CONSTRAINT numeros_pk PRIMARY KEY ( numero );

CREATE TABLE twitter (
    usuario               VARCHAR(16) NOT NULL,
    password              VARCHAR(16),
    consumer_key          VARCHAR(32),
    consumer_secret       VARCHAR(32),
    access_token          VARCHAR(32),
    access_token_secret   VARCHAR(32),
    automatizado          CHAR(1),
    telefonos_numero      VARCHAR(10),
    nichos_nicho          VARCHAR(12) NOT NULL
);

ALTER TABLE twitter ADD CONSTRAINT twitter_pk PRIMARY KEY ( usuario );

CREATE TABLE usuarios (
    usuario    VARCHAR(16) NOT NULL,
    password   VARCHAR(6),
    nombre     VARCHAR(64),
    tipo       VARCHAR(5)
);

ALTER TABLE usuarios
    ADD CHECK ( tipo IN (
        'admin',
        'user'
    ) );

ALTER TABLE usuarios ADD CONSTRAINT usuarios_pk PRIMARY KEY ( usuario );

/*Nueva tabls campañas, insertar a Base de datos.*/
CREATE TABLE campaign (
    nombre    VARCHAR(12) NOT NULL,
    descrip   VARCHAR(64),
    propag    VARCHAR(32),
    tipo      VARCHAR(16),
    inicio    DATE,
    cuentas   INTEGER,
    fin       DATE
);
ALTER TABLE campaign ADD CONSTRAINT campaign_pk PRIMARY KEY ( nombre );
