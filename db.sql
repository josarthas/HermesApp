CREATE TABLE nichos (
    nicho     VARCHAR(12) NOT NULL,
    json      VARCHAR(64),
    resumen   VARCHAR(40)
);
ALTER TABLE nichos ADD CONSTRAINT nichos_pk PRIMARY KEY ( nicho );



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
    consumer_key          VARCHAR(64),
    consumer_secret       VARCHAR(64),
    access_token          VARCHAR(64),
    access_token_secret   VARCHAR(64),
    telefonos_numero      VARCHAR(10)
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
    nombre    VARCHAR(32) NOT NULL,
    nicho     VARCHAR(16),
    descrip   VARCHAR(64),
    propag    VARCHAR(8),
    tipo      VARCHAR(8),
    inicio    DATETIME,
    cuentas   VARCHAR(16),
    fin       DATETIME
);
ALTER TABLE campaign ADD CONSTRAINT campaign_pk PRIMARY KEY ( nombre );
ALTER TABLE campaign
    ADD CHECK ( tipo IN (
        'Uni',
        'Mass'
    ) );
