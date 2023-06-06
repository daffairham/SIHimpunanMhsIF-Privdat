-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 06, 2023 at 04:28 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.0.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `dbprivdat`
--

-- --------------------------------------------------------

--
-- Table structure for table `anggota_proker`
--

CREATE TABLE `anggota_proker` (
  `IdProker` int(11) NOT NULL,
  `IdAnggota` int(11) NOT NULL,
  `peran` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `proker`
--

CREATE TABLE `proker` (
  `idProker` int(11) NOT NULL,
  `namaProker` varchar(100) NOT NULL,
  `isiProker` varchar(500) NOT NULL,
  `statusProkKetua` varchar(10) NOT NULL,
  `statusProkSekben` varchar(11) NOT NULL,
  `idDivisi` int(11) NOT NULL,
  `isiKomenKetua` varchar(1000) NOT NULL,
  `isiKomenSekben` varchar(1000) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `proker`
--

INSERT INTO `proker` (`idProker`, `namaProker`, `isiProker`, `statusProkKetua`, `statusProkSekben`, `idDivisi`, `isiKomenKetua`, `isiKomenSekben`) VALUES
(4, 'Tutoring Mata Kuliah Dasar Pemrogramman', 'Mengajarkan mengenai dasar - dasar pemrogramman untuk bahasa java seperti pembuatan method sederhana, input output, dan lainnya.', 'PENDING', 'PENDING', 3, '', ''),
(5, 'Tutoring Mata Kuliah PBO', 'Mengajarkan mahasiswa untuk mengerti struktur class pada bahasa java, pembuatan class sederhana, dan lainnya.', 'PENDING', 'PENDING', 3, '', ''),
(6, 'Informatics Sport and E-Sport Competition', 'Mengajak mahasiswa untuk berpartisipasi secara aktif dalam kegiatan lomba yang meliputi game seperti valorant, PB, dan kompetisi olahraga pingpong, basket, dan lainnya.', 'PENDING', 'PENDING', 4, '', ''),
(7, 'Olahraga Rutin', 'Mengajak mahasiswa untuk berpartisipasi secara aktif dalam kegiatan olahraga rutin yang diadakan setiap hari sabtu.', 'PENDING', 'PENDING', 4, '', ''),
(8, 'I-Care 2021', 'Bentuk partisipasi mahasiswa teknik informatika untuk berbelasungkawa terhadap masyarakat sekitar yang membutuhkan. Pada kegiatan ini mahasiswa diajak untuk mengirimkan sembako ke panti asuhan Al-Fitra', 'SELESAI', 'SELESAI', 5, '', ''),
(9, 'I-Care 2022', 'Bentuk partisipasi mahasiswa teknik informatika untuk berbelasungkawa terhadap masyarakat sekitar yang membutuhkan. Dalam kegiatan ini mahasiswa diajak untuk membagikan sembako ke panti asuhan Tambatan Hati', 'PENDING', 'PENDING', 5, '', ''),
(10, 'Pendidikan dan Pelatihan HMPSTIF 2022', 'Bentuk kegiatan untuk mempersiapkan calon anggota himpunan mahasiswa teknik informatika.', 'PENDING', 'PENDING', 6, '', ''),
(11, 'IFC Infomasi Creative', 'Informatika Mencari Bakat', 'PENDING', 'PENDING', 7, '', ''),
(12, 'SIAP JURUSAN INFORMATIKA 2023', 'Mempersiapkan calon mahasiswa teknik informatika untuk lebih mengenali kampus dan juga flow belajar di informatika unpar.', 'PENDING', 'PENDING', 8, '', ''),
(13, 'Introduction to Informatics (I2I) 2023', 'Mengenalkan mahasiswa baru mengenai lingkungan informatika.', 'PENDING', 'PENDING', 8, '', '');

-- --------------------------------------------------------

--
-- Table structure for table `proposal`
--

CREATE TABLE `proposal` (
  `idProp` int(11) NOT NULL,
  `namaProp` varchar(100) NOT NULL,
  `statusPropKetua` varchar(10) NOT NULL,
  `statusPropSekben` varchar(10) NOT NULL,
  `isiProp` varchar(100) NOT NULL,
  `idProk` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `rab`
--

CREATE TABLE `rab` (
  `idRab` int(11) NOT NULL,
  `isiRab` int(11) NOT NULL,
  `statusRabKetua` varchar(10) NOT NULL,
  `statusRabSekben` varchar(10) NOT NULL,
  `idProk` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `role`
--

CREATE TABLE `role` (
  `idRole` int(11) NOT NULL,
  `namaRole` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `role`
--

INSERT INTO `role` (`idRole`, `namaRole`) VALUES
(1, 'Ketua / Wakil Ketua Himpunan'),
(2, 'Sekretaris / Bendahara'),
(3, 'Koordinator Divisi - Akademik'),
(4, 'Koordinator Divisi - Seni dan Olahraga'),
(5, 'Koordinator Divisi - Pengabdi Masyarakat'),
(6, 'Koordinator Divisi - Penelitian Pengembangan'),
(7, 'Koordinator Divisi - Media Komunikasi'),
(8, 'Koordinator Divisi - Kemahasiswaan'),
(9, 'Staff - Akademik'),
(10, 'Staff - Seni dan Olahraga'),
(11, 'Staff - Pengabdi Masyarakat'),
(12, 'Staff - Penelitian Pengembangan'),
(13, 'Staff - Media Komunikasi'),
(14, 'Staff - Kemahasiswaan');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `NPM` int(11) NOT NULL,
  `nama` varchar(100) NOT NULL,
  `pwd` varchar(42) NOT NULL,
  `idRole` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`NPM`, `nama`, `pwd`, `idRole`) VALUES
(17001, 'Juna Priya', 'juna1234', 9),
(17002, 'Pramesi Wijayanti', 'pramesi123', 10),
(18001, 'Melita Mulya', 'melita123', 5),
(18002, 'Ricardo Kaka', 'ricardo123', 7),
(18003, 'Jared Leto', 'jared123', 11),
(19000, 'admin', 'admin123', 1),
(19001, 'Pedro Antares', 'pedro123', 4),
(19002, 'Chandra Waluyo', 'chandra123', 6),
(19003, 'Petra Sihombing', 'petra123', 8),
(19004, 'Petra Wicaksana', 'wicaksana123', 12),
(19005, 'Alex Surya', 'alex1234', 13),
(19006, 'Anthony Padilla', 'anthony123', 14),
(19012, 'Fransiskus Anugrah Putra Nusantara Witjaksono', 'nganga123', 3),
(19021, 'Daffa Irham Atharazka', 'e3f85fb72e831fb7ccb1eb3db7fabd3a', 1),
(19047, 'Ruben Remalya Sealtiel Matulessy', 'rubenbau55', 2);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `anggota_proker`
--
ALTER TABLE `anggota_proker`
  ADD KEY `IdAnggota` (`IdAnggota`),
  ADD KEY `IdProker` (`IdProker`);

--
-- Indexes for table `proker`
--
ALTER TABLE `proker`
  ADD PRIMARY KEY (`idProker`);

--
-- Indexes for table `proposal`
--
ALTER TABLE `proposal`
  ADD PRIMARY KEY (`idProp`);

--
-- Indexes for table `rab`
--
ALTER TABLE `rab`
  ADD PRIMARY KEY (`idRab`);

--
-- Indexes for table `role`
--
ALTER TABLE `role`
  ADD PRIMARY KEY (`idRole`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`NPM`),
  ADD KEY `idRole` (`idRole`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `proker`
--
ALTER TABLE `proker`
  MODIFY `idProker` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `proposal`
--
ALTER TABLE `proposal`
  MODIFY `idProp` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `rab`
--
ALTER TABLE `rab`
  MODIFY `idRab` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `role`
--
ALTER TABLE `role`
  MODIFY `idRole` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `anggota_proker`
--
ALTER TABLE `anggota_proker`
  ADD CONSTRAINT `anggota_proker_ibfk_1` FOREIGN KEY (`IdAnggota`) REFERENCES `users` (`NPM`),
  ADD CONSTRAINT `anggota_proker_ibfk_2` FOREIGN KEY (`IdProker`) REFERENCES `proker` (`idProker`);

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`idRole`) REFERENCES `role` (`idRole`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
