import express, { query } from "express";
import mysql from "mysql";
import { flash } from "express-flash-message";
import pdf from "html-pdf";
import ejs from "ejs";
import path, { resolve } from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import fs from "fs";
var route = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dirPath = path.join(__dirname, "uploadedFile");
var route = express.Router();
const upload = multer({ dest: 'uploads/' });
// query

const getProker = (conn) => {
  return new Promise((resolve, reject) => {
    conn.query("SELECT * FROM proker", (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

const getStaffs = (conn) => {
  return new Promise((resolve, reject) => {
    conn.query(
      "SELECT * FROM users WHERE NOT idRole = 1 AND NOT idRole = 2 ",
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      }
    );
  });
};

//Buat nampilin daftar2 proker yang udah terdaftar (Staff)
const getProkerTerdaftar = (conn, npm) => {
  return new Promise((resolve, reject) => {
    conn.query(
      `select proker.idProker, proker.namaProker, proker.statusProkKetua, proker.statusProkSekben, proposal.statusPropKetua, proposal.statusPropSekben, proposal.isiProp, rab.isiRab, rab.statusRabKetua, rab.statusRabSekben from proker LEFT outer join proposal on proker.idProker = proposal.idProker join anggota_proker on anggota_proker.idProker = proker.IdProker left outer join rab on proker.idProker = rab.idProker where anggota_proker.IdAnggota = 19012 and (proker.statusProkKetua = 'ACCEPTED' or proker.statusProkSekben='ACCEPTED' or proker.statusProkKetua = 'PENDING' or proker.statusProkSekben='PENDING' or proposal.statusPropKetua = 'ACCEPTED' or proposal.statusPropKetua = 'REVISI' or rab.statusRabKetua = 'ACCEPTED' or rab.statusRabKetua = 'REVISI');`,
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      }
    );
  });
};

const getProkerIdAdmin = (conn, id) => {
  return new Promise((resolve, reject) => {
    conn.query(
      `SELECT idProker, namaProker, statusProkKetua, isiProker FROM proker WHERE idProker = ${id}`,
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      }
    );
  });
};
const getProkerIdSekben = (conn, id) => {
  return new Promise((resolve, reject) => {
    conn.query(
      `SELECT idProker, namaProker, statusProkSekben, isiProker FROM proker WHERE idProker = ${id}`,
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      }
    );
  });
};

const getStaffProker = (conn, id) => {
  return new Promise((resolve, reject) => {
    conn.query(
      `select users.npm, users.nama, anggota_proker.peran, proker.namaProker
        from users 
        inner join anggota_proker ON
        users.NPM = anggota_proker.IdAnggota
        inner join proker ON
        anggota_proker.IdProker = proker.idProker
        where proker.idProker = ${id}
        ORDER BY
        CASE anggota_proker.peran
        WHEN 'ketua pelaksana' THEN 1
        WHEN 'sekretaris/bendahara' THEN 2
        WHEN 'staff' THEN 3
        END;`,
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      }
    );
  });
};

const getProkerKordiv = (conn, idDiv) => {
  return new Promise((resolve, reject) => {
    conn.query(
      `SELECT * FROM proker WHERE idDivisi = ${idDiv} `,
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      }
    );
  });
};

const getProkerSekben = (conn) => {
  return new Promise((resolve, reject) => {
    conn.query(
      `SELECT * FROM proker WHERE statusProkSekben = "PENDING" `,
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      }
    );
  });
};

const getTopikFilter = (conn, getName) => {
  return new Promise((resolve, reject) => {
    conn.query(
      `SELECT * FROM topik JOIN dosen ON topik.noDosen = dosen.noDosen WHERE dosen.namaD LIKE '%${getName}%' `,
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      }
    );
  });
};

const cekAkses = (conn, id) => {
  return new Promise((resolve, reject) => {
    conn.query(
      "SELECT idAnggota FROM anggota_proker WHERE idProker = ?",
      [id],
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      }
    );
  });
};
const getKomen = (conn, idTopik) => {
  return new Promise((resolve, reject) => {
    conn.query(
      `SELECT dosen.namaD AS namadosen, review.komentar AS komendosen, review.idTopik FROM review JOIN topik ON review.idTopik = topik.idTopik JOIN dosen ON topik.noDosen = dosen.noDosen WHERE review.idTopik ='${idTopik}'`,
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      }
    );
  });
};

const getNamaD = (conn, idTopik) => {
  return new Promise((resolve, reject) => {
    conn.query(
      `SELECT * FROM dosen JOIN review ON dosen.noDosen = review.noDosen`,
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      }
    );
  });
};

const getUsers = (conn) => {
  return new Promise((resolve, reject) => {
    conn.query(
      "SELECT * FROM users INNER JOIN role ON users.idRole = role.idRole ORDER BY users.idRole asc",
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      }
    );
  });
};

const checkLogin = (conn, npm, password) => {
  return new Promise((resolve, reject) => {
    conn.query(
      `SELECT npm, pwd FROM users WHERE npm LIKE '%${npm}%' AND pwd LIKE '%${password}%'`,
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      }
    );
  });
};

const getNameF = (conn, getName) => {
  return new Promise((resolve, reject) => {
    conn.query(
      `SELECT * FROM dosen WHERE namad LIKE '%${getName}%' `,
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      }
    );
  });
};

const getNoDosen = (conn, getName) => {
  return new Promise((resolve, reject) => {
    conn.query(
      `SELECT noDosen FROM dosen WHERE namad LIKE '%${getName}%' `,
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      }
    );
  });
};
const getStatuSS = (conn, getStatus) => {
  return new Promise((resolve, reject) => {
    conn.query(
      `SELECT statusSkripsi FROM topik WHERE statusSkripsi LIKE '%${getStatus}%' `,
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      }
    );
  });
};
const getThn = (conn, getTahun) => {
  return new Promise((resolve, reject) => {
    conn.query(
      `SELECT tahunAjaran FROM topik WHERE tahunAjaran LIKE '%${getTahun}%' `,
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      }
    );
  });
};

//query kelola akun

const getUsername = (conn, akunDiganti) => {
  return new Promise((resolve, reject) => {
    conn.query(
      `SELECT * FROM dosen WHERE username LIKE '%${akunDiganti}%' `,
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      }
    );
  });
};

//query untuk mengubah nama dosen
const updateNama = (conn, namaDiganti, results) => {
  return new Promise((resolve, reject) => {
    conn.query(
      `UPDATE Dosen SET namaD = '${namaDiganti}' WHERE namaD LIKE '%${results[0].namaD}%'`,
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      }
    );
  });
};

//query untuk mengubah password
const updatePassword = (conn, passwordDiganti, results) => {
  return new Promise((resolve, reject) => {
    conn.query(
      `UPDATE Dosen SET pwd = '${passwordDiganti}' WHERE pwd = '${results[0].pwd}'`,
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      }
    );
  });
};

//query untuk mengubah nomor dosen
const updateNoDosen = (conn, noDosenDiganti, results) => {
  return new Promise((resolve, reject) => {
    conn.query(
      `UPDATE Dosen SET noDosen = '${noDosenDiganti}' WHERE noDosen = '${results[0].noDosen}'`,
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      }
    );
  });
};

//query untuk mengubah username
const updateUsername = (conn, usernameDiganti, results) => {
  return new Promise((resolve, reject) => {
    conn.query(
      `UPDATE Dosen SET username = '${usernameDiganti}' WHERE username LIKE '%${results[0].username}%'`,
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      }
    );
  });
};

//query untuk memasukan akun baru ke database
const addAkun = (conn, npm, nama, password, roles) => {
  return new Promise((resolve, reject) => {
    conn.query(
      `INSERT INTO users(NPM,nama,pwd,idRole) VALUES ('${npm}','${nama}','${password}','${roles}')`,
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      }
    );
  });
};
const addStaff = (conn, id, npm, roles) => {
  return new Promise((resolve, reject) => {
    conn.query(
      `INSERT INTO anggota_proker(idProker,idAnggota,peran) VALUES ('${id}','${npm}','${roles}')`,
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      }
    );
  });
};

//query untuk mendapatkan data-data user dosen yang terdaftar
const getUsersPage = (conn) => {
  return new Promise((resolve, reject) => {
    conn.query("SELECT * FROM dosen", (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

const getUsersPage2 = (conn, startLimit, resultsPage) => {
  return new Promise((resolve, reject) => {
    conn.query(
      `SELECT * FROM dosen LIMIT ${startLimit},${resultsPage}`,
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      }
    );
  });
};

//query untuk mendapatkan nilai terbesar dari idtopik di tabel topik
const getMax = (conn) => {
  return new Promise((resolve, rejects) => {
    conn.query("SELECT MAX(idProker) as max FROM proker", (err, result) => {
      if (err) {
        rejects(err);
      } else {
        resolve(result);
      }
    });
  });
};

//query untuk mendapatkan nilai terbesar dari reviewid di tabel review
const getMaxRev = (conn) => {
  return new Promise((resolve, rejects) => {
    conn.query("SELECT MAX(reviewID) as max FROM review", (err, result) => {
      if (err) {
        rejects(err);
      } else {
        resolve(result);
      }
    });
  });
};

//query untuk menambahkan topik
const tambahProker = (conn, idx, namaP, isiP, idDiv) => {
  return new Promise((resolve, reject) => {
    conn.query(
      `INSERT INTO proker (idProker, namaProker, isiProker, statusProkKetua, statusProkSekben, idDivisi, isiKomenKetua, isiKomenSekben) VALUES (${idx},'${namaP}', '${isiP}',"PENDING", "PENDING", '${idDiv}', 0, 0) `,
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      }
    );
  });
};

const tambahProkerProp = (conn, idx, namaP) => {
  return new Promise((resolve, reject) => {
    conn.query(
      `INSERT INTO proposal (namaProp, statusPropKetua, statusPropSekben, isiProp, idProker) VALUES ('${namaP}', "PENDING", "PENDING", NULL, '${idx}') `,
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      }
    );
  });
};
const tambahProkerRab = (conn, idx, namaP) => {
  return new Promise((resolve, reject) => {
    conn.query(
      `INSERT INTO rab (namaRab, isiRab, statusRabKetua, statusRabSekben, idProker) VALUES ('${namaP}', NULL, "PENDING", "PENDING",  '${idx}') `,
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      }
    );
  });
};


const tambahKetuplak = (conn, npm, id) => {
  return new Promise((resolve, reject) => {
    conn.query(
      `INSERT INTO anggota_proker (idProker, idAnggota, peran) VALUES ('${id}', ${npm}, 'Ketua Pelaksana') `,
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      }
    );
  });
};

//query untuk menampilkan topik milik dosen untuk di halaman skripsiSaya
const topikDosen = (conn, noID) => {
  return new Promise((resolve, reject) => {
    conn.query(
      `SELECT idTopik, judulTopik, peminatan, tipe, statusSkripsi FROM topik WHERE noDosen LIKE '%${noID}%' `,
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      }
    );
  });
};

// Connect Database

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "dbprivdat",
});

const dbConnect = () => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, conn) => {
      if (err) {
        reject(err);
      } else {
        resolve(conn);
      }
    });
  });
};

// ambil koneksi Dosen

route.get("/home", async (req, res) => {
  const conn = await dbConnect();
  conn.release();
  var nama = req.session.name;
  var noID = req.session.noID;
  var idRole = req.session.role;
  var namaRole = req.session.namaRole;
  if (req.session.loggedin) {
    if (
      idRole == 2 ||
      idRole == 3 ||
      idRole == 4 ||
      idRole == 5 ||
      idRole == 6 ||
      idRole == 7 ||
      idRole == 8 ||
      idRole == 9 ||
      idRole == 10 ||
      idRole == 11 ||
      idRole == 12 ||
      idRole == 13 ||
      idRole == 14
    ) {
      res.render("home", {
        nama,
        noID,
        idRole,
        namaRole,
      });
    } else {
      res.redirect("/homeAdmin");
    }
  } else {
    req.flash("message", "Anda harus login terlebih dahulu");
    res.redirect("/");
  }
});

// Get buat search filter DaftarTopikDosen
route.get("/daftarProker", express.urlencoded(), async (req, res) => {
  const conn = await dbConnect();
  const npm = req.session.username;
  let results = await getProkerTerdaftar(conn, npm);
  const idTopik = req.body.aTopik;
  const id = req.body.idP;
  const getName = req.query.filter;
  const nama = req.session.name;
  if (getName != undefined && getName.length) {
    if (req.session.loggedin) {
      if (req.session.role == 1) {
        res.render("daftarProker", {
          results,
          comments,
          nama,
          idTopik,
          namaKomen,
          id
        });
      } else {
        res.redirect("/daftarProkerAdmin");
      }
    } else {
      req.flash("message", "anda harus login terlebih dahulu");
      res.redirect("/");
    }
  } else if (req.session.loggedin) {
    if (
      req.session.role == 9 ||
      req.session.role == 10 ||
      req.session.role == 11 ||
      req.session.role == 12 ||
      req.session.role == 13 ||
      req.session.role == 14
    ) {
      res.render("daftarProker", {
        results,
      });
    } else if (req.session.role == 2) {
      res.redirect("/daftarProkerSekben");
    } else if (
      req.session.role == 3 ||
      req.session.role == 4 ||
      req.session.role == 5 ||
      req.session.role == 6 ||
      req.session.role == 7 ||
      req.session.role == 8
    ) {
      res.redirect("/daftarProkerKordiv");
    } else {
      res.redirect("/daftarProkerAdmin");
    }
  } else {
    req.flash("message", "Anda harus login terlebih dahulu");
    res.redirect("/");
  }
  conn.release();
  console.log(results);
});

//daftar proker sekben
route.get("/daftarProkerSekben", express.urlencoded(), async (req, res) => {
  const conn = await dbConnect();
  let results = await getProkerSekben(conn);
  const idTopik = req.body.aTopik;
  const getName = req.query.filter;
  const nama = req.session.name;
  if (getName != undefined && getName.length) {
    results = await getTopikFilter(conn, getName);
    if (req.session.loggedin) {
      if (req.session.role == 2) {
        res.render("daftarProkerSekben", {
          results,
          comments,
          nama,
          idTopik,
          namaKomen,
        });
      } else {
        res.redirect("/daftarProker");
      }
    } else {
      req.flash("message", "anda harus login terlebih dahulu");
      res.redirect("/");
    }
  } else if (req.session.loggedin) {
    if (req.session.role == 2) {
      res.render("daftarProkerSekben", {
        results,
      });
    } else {
      res.redirect("/daftarProker");
    }
  } else {
    req.flash("message", "Anda harus login terlebih dahulu");
    res.redirect("/");
  }
  conn.release();
});

route.get("/daftarProkerAdmin", express.urlencoded(), async (req, res) => {
  const conn = await dbConnect();
  let results = await getProker(conn);
  const idTopik = req.body.aTopik;
  const getName = req.query.filter;
  const nama = req.session.name;
  if (getName != undefined && getName.length) {
    results = await getTopikFilter(conn, getName);
    if (req.session.loggedin) {
      if (req.session.role == 1) {
        res.render("daftarProkerAdmin", {
          results,
          comments,
          nama,
          idTopik,
          namaKomen,
        });
      } else {
        res.redirect("/daftarProker");
      }
    } else {
      req.flash("message", "anda harus login terlebih dahulu");
      res.redirect("/");
    }
  } else if (req.session.loggedin) {
    if (req.session.role == 1) {
      res.render("daftarProkerAdmin", {
        results,
      });
    } else {
      res.redirect("/daftarProker");
    }
  } else {
    req.flash("message", "Anda harus login terlebih dahulu");
    res.redirect("/");
  }
  conn.release();
});

//daftar proker kordiv
route.get("/daftarProkerKordiv", express.urlencoded(), async (req, res) => {
  const idDiv = req.session.role;
  const conn = await dbConnect();
  let results = await getProkerKordiv(conn, idDiv);
  const idTopik = req.body.aTopik;
  const getName = req.query.filter;
  const nama = req.session.name;
  if (getName != undefined && getName.length) {
    results = await getTopikFilter(conn, getName);
    if (req.session.loggedin) {
      if (
        req.session.role == 3 ||
        req.session.role == 4 ||
        req.session.role == 5 ||
        req.session.role == 6 ||
        req.session.role == 7 ||
        req.session.role == 8
      ) {
        res.render("daftarProkerKordiv", {
          results,
        });
      } else {
        res.redirect("/daftarProker");
      }
    } else {
      req.flash("message", "anda harus login terlebih dahulu");
      res.redirect("/");
    }
  } else if (req.session.loggedin) {
    if (
      req.session.role == 3 ||
      req.session.role == 4 ||
      req.session.role == 5 ||
      req.session.role == 6 ||
      req.session.role == 7 ||
      req.session.role == 8
    ) {
      res.render("daftarProkerKordiv", {
        results,
      });
    } else {
      res.redirect("/daftarProker");
    }
  } else {
    req.flash("message", "Anda harus login terlebih dahulu");
    res.redirect("/");
  }
  conn.release();
});

route.get("/daftarProkerSekben", express.urlencoded(), async (req, res) => {
  const conn = await dbConnect();
  let results = await getProker(conn);
  const idTopik = req.body.aTopik;
  const getName = req.query.filter;
  const nama = req.session.name;
  if (getName != undefined && getName.length) {
    results = await getTopikFilter(conn, getName);
    if (req.session.loggedin) {
      if (req.session.role == 2) {
        res.render("daftarProkerSekben", {
          results,
          comments,
          nama,
          idTopik,
          namaKomen,
        });
      } else {
        res.redirect("/daftarProker");
      }
    } else {
      req.flash("message", "anda harus login terlebih dahulu");
      res.redirect("/");
    }
  } else if (req.session.loggedin) {
    if (req.session.role == 2) {
      res.render("daftarProkerSekben", {
        results,
      });
    } else {
      res.redirect("/daftarProker");
    }
  } else {
    req.flash("message", "Anda harus login terlebih dahulu");
    res.redirect("/");
  }
  conn.release();
});

route.get("/daftarProkerAdmin", express.urlencoded(), async (req, res) => {
  const conn = await dbConnect();
  let results = await getProker(conn);
  const idTopik = req.body.aTopik;
  const getName = req.query.filter;
  const nama = req.session.name;
  if (getName != undefined && getName.length) {
    results = await getTopikFilter(conn, getName);
    if (req.session.loggedin) {
      if (req.session.role == 1) {
        res.render("daftarProkerAdmin", {
          results,
          comments,
          nama,
          idTopik,
          namaKomen,
        });
      } else {
        res.redirect("/daftarProker");
      }
    } else {
      req.flash("message", "anda harus login terlebih dahulu");
      res.redirect("/");
    }
  } else if (req.session.loggedin) {
    if (req.session.role == 1) {
      res.render("daftarProkerAdmin", {
        results,
      });
    } else {
      res.redirect("/daftarProker");
    }
  } else {
    req.flash("message", "Anda harus login terlebih dahulu");
    res.redirect("/");
  }
  conn.release();
});

route.get("/addProker", express.urlencoded(), async (req, res) => {
  const conn = await dbConnect();
  const message = req.flash("message");
  conn.release();
  if (req.session.loggedin) {
    res.render("addProker", { message });
  } else {
    res.redirect("/");
  }
});

route.post("/addProker", express.urlencoded(), async (req, res) => {
  //Buat dapetin noDosen
  const namaP = req.body.addProker;
  const isiP = req.body.addIsi;
  const idDiv = req.session.role;
  const conn = await dbConnect();
  let results = await getProker(conn);
  var maxID = await getMax(conn); //Buat dapetin IdTopik terbesar di DB
  var idx = maxID[0].max + 1;
  const npm = req.session.username;
  if (req.session.loggedin) {
    res.redirect("/daftarProkerKordiv");
  } else {
    req.flash("message", "Anda harus login terlebih dahulu");
    res.redirect("/");
  }
  if (namaP.length > 0 && isiP.length > 0) {
    await tambahProker(conn, idx, namaP, isiP, idDiv);
    await tambahKetuplak(conn, npm, idx);
    await tambahProkerProp(conn, idx, namaP);
    await tambahProkerRab(conn, idx, namaP);
  }
});

route.get("/daftarProkerAdmin", express.urlencoded(), async (req, res) => {
  const conn = await dbConnect();
  let results = await getProker(conn);
  const idTopik = req.body.aTopik;
  const getName = req.query.filter;
  const nama = req.session.name;
  if (getName != undefined && getName.length) {
    results = await getTopikFilter(conn, getName);
    if (req.session.loggedin) {
      if (req.session.role == 1) {
        res.render("daftarProkerAdmin", {
          results,
          comments,
          nama,
          idTopik,
          namaKomen,
        });
      } else {
        res.redirect("/daftarProker");
      }
    } else {
      req.flash("message", "anda harus login terlebih dahulu");
      res.redirect("/");
    }
  } else if (req.session.loggedin) {
    if (req.session.role == 1) {
      res.render("daftarProkerAdmin", {
        results,
      });
    } else {
      res.redirect("/daftarProker");
    }
  } else {
    req.flash("message", "Anda harus login terlebih dahulu");
    res.redirect("/");
  }
  conn.release();
});

route.get("/daftarRAB", express.urlencoded(), async (req, res) => {
  const conn = await dbConnect();
  let results = await getProker(conn);
  const idTopik = req.body.aTopik;
  const getName = req.query.filter;
  const nama = req.session.name;
  if (getName != undefined && getName.length) {
    results = await getTopikFilter(conn, getName);
    if (req.session.loggedin) {
      if (req.session.role == 1) {
        res.render("daftarRAB", {
          results,
          comments,
          nama,
          idTopik,
          namaKomen,
        });
      } else {
        res.redirect("/daftarProkerAdmin");
      }
    } else {
      req.flash("message", "anda harus login terlebih dahulu");
      res.redirect("/");
    }
  } else if (req.session.loggedin) {
    if (
      req.session.role == 2 ||
      req.session.role == 3 ||
      req.session.role == 4 ||
      req.session.role == 5 ||
      req.session.role == 6 ||
      req.session.role == 7 ||
      req.session.role == 8 ||
      req.session.role == 9 ||
      req.session.role == 10 ||
      req.session.role == 11 ||
      req.session.role == 12 ||
      req.session.role == 13 ||
      req.session.role == 14
    ) {
      res.render("daftarRAB", {
        results,
      });
    } else {
      res.redirect("/daftarRAB");
    }
  } else {
    req.flash("message", "Anda harus login terlebih dahulu");
    res.redirect("/");
  }
  conn.release();
});

route.post("/daftarTopikDosen2", express.urlencoded(), async (req, res) => {
  const conn = await dbConnect();
  const komen = req.body.komentar;
  const idTopik = req.body.kTopik;
  const noID = req.session.noID;
  var maxID = await getMaxRev(conn); //Buat dapetin IdTopik terbesar di DB
  var idx = maxID[0].max + 1;
  var sql = `INSERT INTO review (reviewID, noDosen, idTopik, komentar) VALUES ('${idx}','${noID}','${idTopik}','${komen}') `;
  conn.query(sql, [idx, idTopik, komen], (err) => {
    if (err) throw err;
    res.redirect("/daftarTopikDosen");
    res.end();
  });
  conn.release();
});

// ambil koneksi Admin

route.get("/homeAdmin", express.urlencoded(), async (req, res) => {
  const conn = await dbConnect();
  conn.release();
  var nama = req.session.name;
  var noID = req.session.noID;
  var idRole = req.session.role;
  var namaRole = req.session.namaRole;
  if (req.session.loggedin) {
    if (idRole == 1) {
      res.render("homeAdmin", {
        nama,
        noID,
        idRole,
        namaRole,
      });
    } else {
      res.send("Anda tidak memiliki akses");
    }
  } else {
    req.flash("message", "Anda harus login terlebih dahulu");
    res.redirect("/");
  }
});

route.post("/homeAdmin", express.urlencoded(), async (req, res) => {
  const conn = await dbConnect();
  const periode = req.body.setPeriode;
  var sql = `SELECT namaPeriode FROM semester WHERE periode ='${periode}'`;
  conn.query(sql, [periode], (err, result) => {
    if (err) throw err;
    res.redirect("/homeAdmin");
  });
});

route.get("/", async (req, res) => {
  const conn = await dbConnect();
  const message = req.flash("message");
  conn.release();
  res.render("login", { message });
});

//File Upload
const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploadedFile");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "--" + file.originalname);
  },
});


route.get("/unggahTopik", express.urlencoded(), async (req, res) => {
  const conn = await dbConnect();
  const message = req.flash("message");
  conn.release();
  if (req.session.loggedin) {
    res.render("unggahTopik", { message });
  } else {
    res.redirect("/");
  }
});

//mengambil koneksi untuk skripsiSaya
route.get("/skripsiSaya", async (req, res) => {
  const noID = req.session.noID;
  const conn = await dbConnect();
  let results = await topikDosen(conn, noID);
  conn.release();
  if (req.session.loggedin) {
    res.render("topikSkripsiSaya", {
      results,
    });
  } else {
    req.flash("message", "Anda harus login terlebih dahulu");
    res.redirect("/");
  }
});

route.post("/skripsiSaya", express.urlencoded(), async (req, res) => {
  const conn = await dbConnect();
  const ubahStat = req.body.gantiStat;
  const idTopik = req.body.noTopik;
  var sql = `UPDATE topik SET statusSkripsi = '${ubahStat}' WHERE idTopik ='${idTopik}'`;
  if (ubahStat == "OPEN" || ubahStat == "CLOSE" || ubahStat == "TAKEN") {
    conn.query(sql, [ubahStat, idTopik], () => {
      res.redirect("/skripsiSaya");
      res.end();
    });
  } else {
    res.send("Data error");
  }
  conn.release();
});

//mengambil koneksi untuk daftartopik + filter nama
route.get("/daftarTopik", express.urlencoded(), async (req, res) => {
  const conn = await dbConnect();
  let results = await getProker(conn);
  const getName = req.query.filter;
  if (getName != undefined && getName.length) {
    //results = await getTopikFilter(conn,getName);
    if (req.session.loggedin) {
      if (req.session.role == 1) {
        res.render("daftarTopik", {
          results,
        });
      } else {
        res.send("Anda tidak memiliki akses");
      }
    } else {
      req.flash("message", "anda harus login terlebih dahulu");
      res.redirect("/");
    }
  } else if (req.session.loggedin) {
    if (req.session.role == 1) {
      res.render("daftarTopik", {
        results,
      });
    } else {
      res.send("Anda tidak memiliki akses");
    }
  } else {
    req.flash("message", "Anda harus login terlebih dahulu");
    res.redirect("/");
  }
  conn.release();
});

// getLaporanDaftarTopik
route.get("/laporanDaftarTopik", express.urlencoded(), async (req, res) => {
  const conn = await dbConnect();
  let results = await getTopik(conn);
  let comments = await getKomen(conn);
  let namaKomen = await getNamaD(conn);
  const getName = req.query.filter;
  const getStatus = req.query.filterStat;
  const getTahun = req.query.filterTahun;
  const nama = req.session.name;
  const idTopik = req.body.kTopik;
  if (
    getName != undefined &&
    getName.length > 0 &&
    getStatus != undefined &&
    getStatus.length > 0 &&
    getTahun != undefined &&
    getTahun.length > 0
  ) {
    let noDosen = await getNoDosen(conn, getName);
    var stat = await getStatuSS(conn, getStatus);
    var thnAjaran = await getThn(conn, getTahun);
    let noDosenData = noDosen[0].noDosen;
    var inputStatus = stat[0].statusSkripsi;
    var inputTahun = thnAjaran[0].tahunAjaran;
    results = await getTopikFilter(conn, noDosenData, inputTahun, inputStatus);
    if (req.session.loggedin) {
      if (req.session.role == "Admin") {
        res.render("daftarTopik", {
          results,
          comments,
          nama,
          idTopik,
          namaKomen,
        });
      } else {
        res.send("Anda tidak memiliki akses");
      }
    } else {
      req.flash("message", "anda harus login terlebih dahulu");
      res.redirect("/");
    }
  } else if (req.session.loggedin) {
    if (req.session.role == "Admin") {
      res.render("laporanDaftarTopik", {
        results,
        comments,
        nama,
        idTopik,
        namaKomen,
      });
    } else {
      res.send("Anda tidak memiliki akses");
    }
  } else {
    req.flash("message", "Anda harus login terlebih dahulu");
    res.redirect("/");
  }
  conn.release();
});

route.get("/daftarTopik2", express.urlencoded(), async (req, res) => {
  const conn = await dbConnect();
  let results = await getTopik(conn);
  let comments = await getKomen(conn);
  let namaKomen = await getNamaD(conn);
  const nama = req.session.name;
  const idTopik = req.body.plisTopik;
  if (req.session.loggedin) {
    if (req.session.role == "Admin") {
      res.render("daftarTopik", {
        results,
        comments,
        nama,
        idTopik,
        namaKomen,
      });
    } else {
      res.send("Anda tidak memiliki akses");
    }
  } else {
    req.flash("message", "Anda harus login terlebih dahulu");
    res.redirect("/");
  }
  conn.release();
});

//get delete topik
route.get("/daftarTopik3", express.urlencoded(), async (req, res) => {
  const conn = await dbConnect();
  let results = await getTopik(conn);
  let comments = await getKomen(conn);
  let namaKomen = await getNamaD(conn);
  const nama = req.session.name;
  const idTopik = req.body.kTopik;
  if (req.session.loggedin) {
    if (req.session.role == "Admin") {
      res.render("daftarTopik", {
        results,
        comments,
        nama,
        idTopik,
        namaKomen,
      });
    } else {
      res.send("Anda tidak memiliki akses");
    }
  } else {
    req.flash("message", "Anda harus login terlebih dahulu");
    res.redirect("/");
  }
  conn.release();
});

//mengubah status skripsi
route.post("/daftarTopik", express.urlencoded(), async (req, res) => {
  const conn = await dbConnect();
  const ubahStat = req.body.gantiStat;
  const idProker = req.body.noTopik;
  var sql = `UPDATE proker SET statusProk = '${ubahStat}' WHERE idProker ='${idProker}'`;
  if (ubahStat == "DITERIMA" || ubahStat == "REVISI" || ubahStat == "PENDING") {
    conn.query(sql, [ubahStat, idProker], () => {
      res.redirect("/daftarProkerAdmin");
      res.end();
    });
  } else {
    res.send("Data Error");
  }
});

//delete topik
route.post("/daftarTopik3", express.urlencoded(), async (req, res) => {
  const conn = await dbConnect();
  const idTopik = req.body.noTopik;
  var sql = `DELETE FROM topik WHERE idTopik ='${idTopik}'`;
  conn.query(sql, [idTopik], () => {
    res.redirect("/daftarTopik");
    res.end();
  });
});

//menambahkan komentar
route.post("/daftarTopik2", express.urlencoded(), async (req, res) => {
  const conn = await dbConnect();
  const komen = req.body.komentar;
  const idTopik = req.body.kTopik;
  const noID = req.session.noID;
  var maxID = await getMaxRev(conn); //Buat dapetin IdTopik terbesar di DB
  var idx = maxID[0].max + 1;
  var sql = `INSERT INTO review (reviewID, noDosen, idTopik, komentar) VALUES ('${idx}','${noID}','${idTopik}','${komen}') `;
  conn.query(sql, [idx, idTopik, komen], (err) => {
    if (err) throw err;
    res.redirect("/daftarTopik");
    res.end();
  });
  conn.release();
});

//Generate Report PDF
route.post(
  "/daftarTopikExportToPDF",
  express.urlencoded(),
  async (req, res) => {
    const conn = await dbConnect();
    let results = await getTopik(conn);
    let options = {
      height: "11.25in",
      width: "8.5in",
      header: {
        height: "20mm",
      },
      footer: {
        height: "20mm",
      },
    };
    res.render("laporanDaftarTopik", { results }, function (err, html) {
      pdf
        .create(html, options)
        .toFile(
          "./views/laporan/LaporanTopikSkripsi.pdf",
          function (err, result) {
            if (err) {
              console.log(err);
            } else {
              console.log("file created");
              res.redirect("/daftarTopik");
            }
          }
        );
    });
    conn.release();
  }
);

//kelola akun
route.get("/kelolaAkun", express.urlencoded(), async (req, res) => {
  if (req.session.role == "Admin") {
    const getName = req.query.filter;
    const conn = await dbConnect();
    let results = await getUsersPage(conn);
    const numResults = results.length;
    let resultsPage = 3;
    const numPages = Math.ceil(numResults / resultsPage);
    let page = req.query.page ? Number(req.query.page) : 1;
    if (page > numPages) {
      res.redirect("/kelolaAkun?page=" + encodeURIComponent(numPages));
    } else if (page < 1) {
      res.redirect("/kelolaAkun?page=" + encodeURIComponent("1"));
    }
    let startLimit = (page - 1) * resultsPage;

    results = await getUsersPage2(conn, startLimit, resultsPage);
    let iteration = page - 3 < 1 ? 1 : page - 2;
    let ending =
      iteration + 7 <= numPages ? iteration + 7 : page + (numPages - page);
    if (ending < page + 1) {
      iteration -= page + 1 - numPages;
    }
    if (req.session.loggedin) {
      if ((req.session.role = "Admin")) {
        res.render("kelolaAkun", {
          results: results,
          page,
          iteration,
          ending,
          numPages,
        });
      } else {
        res.send("Anda tidak memiliki akses");
      }
    } else {
      req.flash("message", "anda harus login terlebih dahuluu");
      res.redirect("/");
    }
    //search filter
    if (getName != undefined && getName.length > 0) {
      results = await getNameF(conn, getName);
      if (req.session.loggedin) {
        if (req.session.role == "Admin") {
          res.render("kelolaAkun", {
            results: results,
            page,
            iteration,
            ending,
            numPages,
          });
        } else {
          res.send("Anda tidak memiliki akses");
        }
      } else {
        req.flash("message", "anda harus login terlebih dahulu");
        res.redirect("/");
      }
      conn.release();
    }
  } else {
    res.send("Anda tidak memiliki akses");
  }
});

route.post("/kelolaAkun", express.urlencoded(), async (req, res) => {
  const conn = await dbConnect();
  if (req.session.loggedin) {
    if (req.session.role == "Admin") {
      res.redirect("kelolaAkunLanjutan");
    } else {
      res.send("Anda tidak memiliki akses");
    }
  } else {
    req.flash("message", "anda harus login terlebih dahulu");
    res.redirect("/");
  }
});

route.get("/kelolaAkunLanjutan", express.urlencoded(), async (req, res) => {
  const conn = await dbConnect();
  conn.release();
  if (req.session.loggedin) {
    if (req.session.role == "Admin") {
      res.render("kelolaAkunLanjutan");
    } else {
      res.send("Anda tidak memiliki akses");
    }
  } else {
    req.flash("message", "anda harus login terlebih dahulu");
    res.redirect("/");
  }
});

route.post("/kelolaAkunLanjutan", express.urlencoded(), async (req, res) => {
  const conn = await dbConnect();
  let akunDiganti = req.body.akunGanti;
  let results = await getUsername(conn, akunDiganti);
  const namaDiganti = req.body.gantiNama;
  const usernameDiganti = req.body.gantiUsername;
  const passwordDiganti = req.body.gantiPassword;
  const noDosenDiganti = req.body.gantiNoDosen;
  if (namaDiganti.length > 0) {
    await updateNama(conn, namaDiganti, results);
  }
  if (passwordDiganti.length > 0) {
    await updatePassword(conn, passwordDiganti, results);
  }
  if (noDosenDiganti.length > 0) {
    await updateNoDosen(conn, noDosenDiganti, results);
  }
  if (usernameDiganti.length > 0) {
    await updateUsername(conn, usernameDiganti, results);
  }
  conn.release();
  res.redirect("kelolaAkun");
});

//Post add user Page
route.post("/addUserPage", async (req, res) => {
  if (req.session.loggedin) {
    if (req.session.role == "Admin") {
      const conn = await dbConnect();
      res.redirect("/addUser");
      conn.release();
    } else {
      res.send("Anda tidak memiliki akses");
    }
  } else {
    req.flash("message", "anda harus login terlebih dahulu");
    res.redirect("/");
  }
});

//Get Add User Page

route.get("/addUser", express.urlencoded(), async (req, res) => {
  if (req.session.loggedin) {
    if (req.session.role == 1) {
      const conn = await dbConnect();
      res.render("addUser");
      conn.release();
    } else {
      res.send("Anda tidak memiliki akses");
    }
  } else {
    req.flash("message", "anda harus login terlebih dahulu");
    res.redirect("/");
  }
});

//memanggil koneksi addAkun
route.post("/addAkun", express.urlencoded(), async (req, res) => {
  if (req.session.loggedin) {
    if (req.session.role == 1) {
      const conn = await dbConnect();
      const nama = req.body.addNama;
      const password = req.body.addPassword;
      const npm = req.body.addNPM;
      const roles = req.body.Roles;
      if (
        nama.length > 0 &&
        password.length > 0 &&
        npm.length > 0 &&
        roles.length > 0
      ) {
        if (req.session.role == 1) {
          await addAkun(conn, npm, nama, password, roles);
          res.redirect("/daftarUser");
        } else {
          res.send("error");
        }
      }
      conn.release();
    } else {
      res.send("Anda tidak memilki akses");
    }
  } else {
    req.flash("message", "anda harus login terlebih dahulu");
    res.redirect("/");
  }
});

//halaman log-in
route.post("/", express.urlencoded(), async (req, res) => {
  const conn = await dbConnect();
  const cekUser = checkLogin(conn, npm, password);
  var npm = req.body.user;
  var password = req.body.pass;
  var sql = `SELECT * FROM users INNER JOIN role ON users.idRole = role.idRole WHERE npm ='${npm}' AND pwd ='${password}'`;
  conn.query(sql, [npm, password], (err, results) => {
    if (err) throw err;
    if (results.length > 0) {
      req.session.loggedin = true;
      req.session.username = npm;
      req.session.name = results[0].nama;
      req.session.noID = results[0].npm;
      req.session.role = results[0].idRole;
      req.session.namaRole = results[0].namaRole;
      if (results[0].idRole == 1) {
        res.redirect("/homeAdmin");
      } else if (
        results[0].idRole == 2 ||
        results[0].idRole == 3 ||
        results[0].idRole == 4 ||
        results[0].idRole == 5 ||
        results[0].idRole == 6 ||
        results[0].idRole == 7 ||
        results[0].idRole == 8 ||
        results[0].idRole == 9 ||
        results[0].idRole == 10 ||
        results[0].idRole == 11 ||
        results[0].idRole == 12 ||
        results[0].idRole == 13 ||
        results[0].idRole == 14
      ) {
        res.redirect("/home");
      }
    } else if ((npm = "" || password == "")) {
      req.flash("message", "Username atau Password Tidak Boleh Kosong!");
      res.redirect("/");
    } else {
      req.flash("message", "Username atau Password Anda salah!");
      res.redirect("/");
    }
    res.end();
    console.log(req.session);
  });
});

export { route };

//halaman daftarUser
route.get("/daftarUser", express.urlencoded(), async (req, res) => {
  const conn = await dbConnect();
  let results = await getUsers(conn);
  conn.release();
  var nama = req.session.name;
  var noID = req.session.noID;
  var idRole = req.session.role;
  var namaRole = req.session.namaRole;
  if (req.session.loggedin) {
    if (idRole == 1) {
      res.render("daftarUser", {
        nama,
        noID,
        idRole,
        namaRole,
        results,
      });
    } else {
      res.send("Anda tidak memiliki akses");
    }
  } else {
    req.flash("message", "Anda harus login terlebih dahulu");
    res.redirect("/");
  }
});

// get current proposal
const getCurrentProposal = (conn, id) => {
  return new Promise((resolve, reject) => {
    conn.query(
      "SELECT * FROM proposal WHERE idProker = ?",
      [id],
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      }
    );
  });
};

const getCurrentRab = (conn, id) => {
  return new Promise((resolve, reject) => {
    conn.query("SELECT * FROM rab WHERE idProker = ?", [id], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

// Halaman isiProposal
route.post('/uploadProp/:idProker', upload.single('fileUpload'), express.urlencoded(), async (req, res) => {
    const conn = await dbConnect();
    const idProker = req.params.idProker;
    console.log(idProker)
    
    const namaProp = req.body.namaProp;
    const fileUpload = req.file;
    const fileData = {
      
      namaProp: namaProp,
      isiProp: fileUpload.name,
      idProker: idProker,
    };
    conn.query(`INSERT INTO proposal (namaProp, statusPropKetua, statusPropSekben, isiProp, idProker) VALUES('${namaProp}', "PENDING", "PENDING", '${fileUpload.name}', '${idProker}')`, fileData, (error, results) => {
      if (error) {
        console.error(error);

      }
      res.redirect("/daftarProker");
    });
    console.log(idProker)
});

route.post("/isiProp", express.urlencoded(), async (req, res) => {
  const conn = await dbConnect();
  const idUser = req.session.username;
  const id = req.body.id;
  var idRole = req.session.role;
  let daftarAkses = [];
  let akses = await cekAkses(conn, id);
  daftarAkses.push(akses);

  if (req.session.loggedin) {
    if (idRole >= 1) {
      res.redirect(`/isiProp/${id}`);
    } else {
      res.send("Anda tidak memiliki akses");
    }
  } else {
    req.flash("message", "Anda harus login terlebih dahulu");
    res.redirect("/");
  }
  conn.release();
});

route.get("/isiProp/:id", express.urlencoded(), async (req, res) => {
  const conn = await dbConnect();
  const id = req.params.id;
  let results = await getCurrentProposal(conn, id);
  var idRole = req.session.role;
  let daftarAkses = [];
  const idUser = req.session.username;
  let bool = false;

  let akses = await cekAkses(conn, id);
  daftarAkses = akses.map((row) => row.idAnggota);
  if (req.session.loggedin) {
    for (let i = 0; i < daftarAkses.length; i++) {
      if (daftarAkses[i] == idUser) {
        console.log(daftarAkses[i]);
        bool = true;
      }
    }
    if (bool === true) {
      res.render("isiProp", { id, results, idUser, akses });
    } else {
      res.send("Anda tidak memiliki akses");
    }
  } else {
    req.flash("message", "Anda harus login terlebih dahulu");
    res.redirect("/");
  }
  conn.release();
});

// Halaman isiRAB
route.post('/uploadRab', upload.single('fileUpload'), express.urlencoded(), async (req, res) => {
    const conn = await dbConnect();
    const idProker = req.body.id;
    const namaRab = req.body.namaRab;
    const fileUpload = req.file;
    const fileData = {
      idRab: idProker,
      namaRab: namaRab,
      isiRab: fileUpload.name,
      idProker: idProker,
    };
    conn.query(`UPDATE rab SET isiRab = '${fileUpload.name}', namaRab = '${namaRab}' WHERE idProker = '${idProker}'`, fileData, (error, results) => {
      if (error) {
        console.error(error);
      }
      res.redirect("/daftarProker");
    });
});

route.post("/isiRab", express.urlencoded(), async (req, res) => {
  const conn = await dbConnect();
  conn.release();
  const id = req.body.id;
  var idRole = req.session.role;
  if (req.session.loggedin) {
    if (idRole >= 1) {
      res.redirect(`/isiRAB/${id}`);
    } else {
      res.send("Anda tidak memiliki akses");
    }
  } else {
    req.flash("message", "Anda harus login terlebih dahulu");
    res.redirect("/");
  }
});

route.get("/isiRab/:id", express.urlencoded(), async (req, res) => {
  const conn = await dbConnect();
  const id = req.params.id;
  let results = await getCurrentRab(conn, id);
  var idRole = req.session.role;
  let daftarAkses = [];
  const idUser = req.session.username;
  let bool = false;

  let akses = await cekAkses(conn, id);
  daftarAkses = akses.map((row) => row.idAnggota);
  if (req.session.loggedin) {
    for (let i = 0; i < daftarAkses.length; i++) {
      if (daftarAkses[i] == idUser) {
        console.log(daftarAkses[i]);
        bool = true;
      }
    }
    if (bool === true) {
      res.render("isiRab", { id, results, idUser, akses });
    } else {
      res.send("Anda tidak memiliki akses");
    }
  } else {
    req.flash("message", "Anda harus login terlebih dahulu");
    res.redirect("/");
  }
  conn.release();
});

route.post("/isiProkerAdmin", express.urlencoded(), async (req, res) => {
  const conn = await dbConnect();
  conn.release();
  const id = req.body.id;
  var idRole = req.session.role;
  if (req.session.loggedin) {
    if (idRole == 1) {
      res.redirect(`/isiProkerAdmin/${id}`);
    } else {
      res.send("Anda tidak memiliki akses");
    }
  } else {
    req.flash("message", "Anda harus login terlebih dahulu");
    res.redirect("/");
  }
});
route.get("/isiProkerAdmin/:id", express.urlencoded(), async (req, res) => {
  const conn = await dbConnect();
  const id = req.params.id;
  let results = await getProkerIdAdmin(conn, id);
  let staffs = await getStaffProker(conn, id);
  var idRole = req.session.role;
  if (req.session.loggedin) {
    if (idRole == 1) {
      res.render("isiProkerAdmin", { id, results, staffs });
    } else {
      res.send("Anda tidak memiliki akses");
    }
  } else {
    req.flash("message", "Anda harus login terlebih dahulu");
    res.redirect("/");
  }
  conn.release();
});

route.post("/isiProkerSekben", express.urlencoded(), async (req, res) => {
  const conn = await dbConnect();
  conn.release();
  const id = req.body.id;
  var nama = req.session.name;
  var noID = req.session.noID;
  var idRole = req.session.role;
  var namaRole = req.session.namaRole;
  if (req.session.loggedin) {
    if (idRole == 2) {
      res.redirect(`/isiProkerSekben/${id}`);
    } else {
      res.send("Anda tidak memiliki akses");
    }
  } else {
    req.flash("message", "Anda harus login terlebih dahulu");
    res.redirect("/");
  }
});
route.get("/isiProkerSekben/:id", express.urlencoded(), async (req, res) => {
  const conn = await dbConnect();
  const id = req.params.id;
  let results = await getProkerIdSekben(conn, id);
  let staffs = await getStaffProker(conn, id);
  var idRole = req.session.role;
  if (req.session.loggedin) {
    if (idRole == 2) {
      res.render("isiProkerSekben", { id, results, staffs });
    } else {
      res.send("Anda tidak memiliki akses");
    }
  } else {
    req.flash("message", "Anda harus login terlebih dahulu");
    res.redirect("/");
  }
  conn.release();
});

route.post("/isiProker", express.urlencoded(), async (req, res) => {
  const conn = await dbConnect();
  conn.release();
  const id = req.body.id;
  var nama = req.session.name;
  var noID = req.session.noID;
  var idRole = req.session.role;
  var namaRole = req.session.namaRole;
  if (req.session.loggedin) {
    if (idRole != 1 || idRole != 2) {
      res.redirect(`/isiProker/${id}`);
    } else {
      res.send("Anda tidak memiliki akses");
    }
  } else {
    req.flash("message", "Anda harus login terlebih dahulu");
    res.redirect("/");
  }
});

route.get("/isiProker/:id", express.urlencoded(), async (req, res) => {
  const conn = await dbConnect();
  const id = req.params.id;
  let results = await getProkerIdAdmin(conn, id);
  let staffs = await getStaffProker(conn, id);
  var idRole = req.session.role;
  if (req.session.loggedin) {
    if (idRole != 1 || idRole != 2) {
      res.render("isiProker", { id, results, staffs, idRole });
    } else {
      res.send("Anda tidak memiliki akses");
    }
  } else {
    req.flash("message", "Anda harus login terlebih dahulu");
    res.redirect("/");
  }
  conn.release();
});

route.post("/addStaff/", express.urlencoded(), async (req, res) => {
  const conn = await dbConnect();
  const idRole = req.session.role;
  const npm = req.body.addNama;
  const id = req.body.id;
  const roles = req.body.Roles;
  if (req.session.loggedin) {
    if (
      idRole == 3 ||
      idRole == 4 ||
      idRole == 5 ||
      idRole == 6 ||
      idRole == 7 ||
      idRole == 8
    ) {
      if (
        idRole == 3 ||
        idRole == 4 ||
        idRole == 5 ||
        idRole == 6 ||
        idRole == 7 ||
        idRole == 8
      ) {
        await addStaff(conn, id, npm, roles);
        res.redirect("/daftarProkerKordiv");
      } else {
        res.send("error");
      }
      conn.release();
    } else {
      res.send("Anda tidak memilki akses");
    }
  } else {
    req.flash("message", "anda harus login terlebih dahulu");
    res.redirect("/");
  }
});

route.get("/addStaff/:id", express.urlencoded(), async (req, res) => {
  const conn = await dbConnect();
  const id = req.params.id;
  let results = await getProker(conn, id);
  let staffs = await getStaffs(conn, id);
  var idRole = req.session.role;
  if (req.session.loggedin) {
    if (
      idRole == 3 ||
      idRole == 4 ||
      idRole == 5 ||
      idRole == 6 ||
      idRole == 7 ||
      idRole == 8
    ) {
      res.render("tambahstaff", { id, results, staffs });
    } else {
      res.send("Anda tidak memiliki akses");
    }
  } else {
    req.flash("message", "Anda harus login terlebih dahulu");
    res.redirect("/");
  }
  conn.release();
  console.log(id);
});
