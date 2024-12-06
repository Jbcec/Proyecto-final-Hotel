const fs = require('fs/promises');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const CONFIG = require('./config');

const dbFilePath = path.join(__dirname, CONFIG.DATABASE_FILE);
const scriptsPaths = [
  path.join(__dirname, 'db-scripts/TAB_CLIENTES.sql'),
  path.join(__dirname, 'db-scripts/TAB_RESERVAS.sql'),
  path.join(__dirname, 'db-scripts/TAB_HABITACIONES.sql'),
  path.join(__dirname, 'db-scripts/TAB_PAGOS.sql'),
  path.join(__dirname, 'db-scripts/TAB_INSUMOS.sql'),
  path.join(__dirname, 'db-scripts/TAB_RESERVAS_HABITACIONES.sql'),
  path.join(__dirname, 'db-scripts/TAB_HABITACIONES_INSUMOS.sql'),
];

fs.access(dbFilePath)

  .then(() => {
    console.log("> Archivo DB encontrado.")
    console.log("> Sobreescribiendo DB.")
    fs.writeFile(dbFilePath, '');

    console.log("> DB Generada.")

  })

  .catch(() => {
    console.log("> Archivo DB no encontrado.")
    console.log("> Generando DB.")

    fs.writeFile(dbFilePath, '');

    console.log("> DB Generada.")
  });


const db = new sqlite3.Database(dbFilePath, (err) => {
  if (err) console.error('X Error al conectar con la base de datos:', err);
  else console.log('> Conectado con la base de datos, empezando a popular.')
});

const ejecutarScript = (script) => {
  return new Promise((resolve, reject) => {
    db.exec(script, (err) => {
      if (err) reject(err);
      else resolve();
    })
  });
};

const generarEstructura = async () => {
  try {
    for (const sp of scriptsPaths) {
      const script = await fs.readFile(sp, 'utf8');
      console.log(`>> Ejecutando: ${sp}`);
      await ejecutarScript(script);
    }
  }
  catch (err) {
    console.error('XX Error al ejecutar los scripts:', err);
  }
  finally {
    db.close((err) => {
      if (err) console.error('X Error al cerrar la base de datos:', err);
      else console.log('> Conexión DB cerrada.');
    });
  }
};

generarEstructura();
