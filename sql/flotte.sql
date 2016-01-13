-- phpMyAdmin SQL Dump
-- version 4.0.4
-- http://www.phpmyadmin.net
--
-- Client: localhost
-- Généré le: Ven 20 Novembre 2015 à 08:20
-- Version du serveur: 5.6.12-log
-- Version de PHP: 5.4.16

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Base de données: `flotte`
--
CREATE DATABASE IF NOT EXISTS `flotte` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `flotte`;

-- --------------------------------------------------------

--
-- Structure de la table `tj_transics_optigest`
--

CREATE TABLE IF NOT EXISTS `tj_transics_optigest` (
  `idTransics` int(11) NOT NULL,
  `idOptigest` int(11) NOT NULL,
  `dateCreation` datetime NOT NULL,
  `user` varchar(32) NOT NULL,
  PRIMARY KEY (`idTransics`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COMMENT='Table de Jointure Transics-Optigest';

-- --------------------------------------------------------

--
-- Structure de la table `t_arret_travail_at`
--

CREATE TABLE IF NOT EXISTS `t_arret_travail_at` (
  `IdAT` int(11) NOT NULL AUTO_INCREMENT,
  `at_type_fk` int(11) NOT NULL,
  `at_PersonTransicsID` int(11) NOT NULL,
  `at_date` date NOT NULL,
  `at_duree` int(11) NOT NULL COMMENT 'Equivallent de duree TT (mn)',
  `at_user` varchar(64) CHARACTER SET latin1 NOT NULL,
  `at_date_crea` datetime NOT NULL,
  PRIMARY KEY (`IdAT`),
  UNIQUE KEY `at_PersonTransicsID_2` (`at_PersonTransicsID`,`at_date`),
  KEY `at_PersonTransicsID` (`at_PersonTransicsID`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=12236 ;

-- --------------------------------------------------------

--
-- Structure de la table `t_autoroute_atr`
--

CREATE TABLE IF NOT EXISTS `t_autoroute_atr` (
  `IdATR` int(11) NOT NULL AUTO_INCREMENT,
  `atr_numParc` varchar(8) NOT NULL,
  `atr_immat` varchar(12) NOT NULL,
  `atr_dtEntree` datetime NOT NULL,
  `atr_nomEntree` varchar(32) NOT NULL,
  `atr_dtSortie` datetime NOT NULL,
  `atr_nomSortie` varchar(32) NOT NULL,
  `art_montant` int(11) NOT NULL,
  `art_km` int(11) NOT NULL,
  `art_dateImport` datetime NOT NULL,
  PRIMARY KEY (`IdATR`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Structure de la table `t_driver`
--

CREATE TABLE IF NOT EXISTS `t_driver` (
  `PersonTransicsID` int(11) NOT NULL,
  `PersonID` varchar(16) NOT NULL,
  `drv_tmp_serv_mois` int(11) DEFAULT NULL,
  `drv_tmp_reserve` int(11) NOT NULL,
  `drv_color` varchar(8) NOT NULL,
  `drv_bgcolor` varchar(8) NOT NULL,
  `drv_user` varchar(64) NOT NULL,
  `drv_dateImport` datetime NOT NULL,
  PRIMARY KEY (`PersonTransicsID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COMMENT='Temps de services mensuels conducteur';

-- --------------------------------------------------------

--
-- Structure de la table `t_driver_tt`
--

CREATE TABLE IF NOT EXISTS `t_driver_tt` (
  `PersonTransicsID` int(11) NOT NULL,
  `PersonID` varchar(16) NOT NULL,
  `drv_tmp_serv_mois` int(11) DEFAULT NULL,
  `drv_tmp_reserve` int(11) NOT NULL,
  `drv_user` varchar(64) NOT NULL,
  `drv_dateImport` datetime NOT NULL,
  PRIMARY KEY (`PersonTransicsID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COMMENT='Temps de services mensuels conducteur';

-- --------------------------------------------------------

--
-- Structure de la table `t_heure_du_hdu`
--

CREATE TABLE IF NOT EXISTS `t_heure_du_hdu` (
  `IdHd` int(11) NOT NULL AUTO_INCREMENT,
  `PersonTransicsID` int(11) NOT NULL,
  `hdu_date` varchar(8) NOT NULL,
  `hdu_soldeHrPrec1` float NOT NULL,
  `hdu_soldeMtPrec1` int(11) NOT NULL,
  `hdu_soldeHrPrec2` float DEFAULT NULL,
  `hdu_soldeMtPrec2` int(11) NOT NULL,
  `hdu_pxHr1` float NOT NULL,
  `hdu_pxHr2` float NOT NULL,
  `hdu_duEntreprise1` float NOT NULL,
  `hdu_duEntreprise2` float NOT NULL,
  `hdu_duEntrepriseAjust` int(11) NOT NULL,
  `hdu_duConductHr1` float NOT NULL,
  `hdu_duConductMt1` int(11) NOT NULL,
  `hdu_duConductHr2` float NOT NULL,
  `hdu_primeA` int(11) NOT NULL,
  `hdu_primeA1` int(11) NOT NULL,
  `hdu_primeB` int(11) NOT NULL,
  `hdu_primeB1` int(11) NOT NULL,
  `hdu_primeC` int(11) NOT NULL,
  `hdu_dateCrea` datetime NOT NULL,
  `hdu_user` varchar(32) NOT NULL,
  PRIMARY KEY (`IdHd`),
  UNIQUE KEY `PersonTransicsID` (`PersonTransicsID`,`hdu_date`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=21163 ;

-- --------------------------------------------------------

--
-- Structure de la table `t_km_parcourt`
--

CREATE TABLE IF NOT EXISTS `t_km_parcourt` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Driver` varchar(16) NOT NULL,
  `DriverTransicsId` int(11) NOT NULL,
  `Trailer` varchar(16) NOT NULL,
  `Vehicle` varchar(16) NOT NULL,
  `VehicleTransicsId` int(10) unsigned NOT NULL,
  `poiID` int(11) DEFAULT NULL,
  `KmBegin` int(11) NOT NULL,
  `KmEnd` int(11) NOT NULL,
  `BeginDate` datetime NOT NULL,
  `EndDate` datetime NOT NULL,
  `AddressInfo` varchar(64) DEFAULT NULL,
  `TransicsID` int(10) unsigned DEFAULT NULL,
  `km_dateImport` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `TransicsID` (`TransicsID`),
  KEY `Trailer` (`Trailer`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=589541 ;

-- --------------------------------------------------------

--
-- Structure de la table `t_or`
--

CREATE TABLE IF NOT EXISTS `t_or` (
  `IdOR` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `or_TransicsVehicleId` int(10) unsigned DEFAULT NULL,
  `or_idVehicle` varchar(8) NOT NULL,
  `or_date` date NOT NULL,
  `or_km` int(10) unsigned NOT NULL,
  `or_prestataire` varchar(32) NOT NULL,
  `or_numFacture` varchar(16) NOT NULL,
  `or_dateFacture` date NOT NULL,
  `or_montant` int(11) NOT NULL,
  `or_description` text NOT NULL,
  `or_assurance` tinyint(4) DEFAULT NULL,
  `or_user` varchar(64) NOT NULL,
  `or_date_saisie` datetime NOT NULL,
  `or_date_annule` datetime DEFAULT NULL,
  PRIMARY KEY (`IdOR`),
  KEY `or_TransicsVehicleId` (`or_TransicsVehicleId`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=3812 ;

-- --------------------------------------------------------

--
-- Structure de la table `t_report_consom-csm`
--

CREATE TABLE IF NOT EXISTS `t_report_consom-csm` (
  `IdCsm` int(11) NOT NULL AUTO_INCREMENT,
  `DriverTransicsId` int(11) NOT NULL,
  `VehicleTransicsId` int(11) NOT NULL,
  `Date` date NOT NULL,
  `Distance` int(11) NOT NULL,
  `Consumption_Total` decimal(8,1) NOT NULL,
  `Duration_Driving` int(11) NOT NULL,
  `conso_dateImport` datetime NOT NULL,
  PRIMARY KEY (`IdCsm`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COMMENT='Rapport de consommation' AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Structure de la table `t_trailer`
--

CREATE TABLE IF NOT EXISTS `t_trailer` (
  `TransicsID` int(10) unsigned NOT NULL,
  `ID` varchar(8) NOT NULL,
  `Code` varchar(8) NOT NULL,
  `Filter` varchar(32) NOT NULL,
  `ChassisNumber` varchar(32) DEFAULT NULL COMMENT 'Marque de la Remorque',
  `LicensePlate` varchar(12) NOT NULL,
  `FormattedName` varchar(16) NOT NULL,
  `tr_dateImport` datetime NOT NULL,
  PRIMARY KEY (`TransicsID`),
  KEY `ID` (`ID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COMMENT='Importation Remorque Transics';

-- --------------------------------------------------------

--
-- Structure de la table `t_ts_service_tsm`
--

CREATE TABLE IF NOT EXISTS `t_ts_service_tsm` (
  `IdTsm` int(11) NOT NULL AUTO_INCREMENT,
  `PersonTransicsID` int(11) NOT NULL,
  `tsm_date` varchar(8) NOT NULL COMMENT 'YYYY-MM',
  `tsm_conduiteDisque` float NOT NULL,
  `tsm_totalDisque` float NOT NULL,
  `tsm_taReel` float NOT NULL,
  `tsm_taReelModif` float NOT NULL,
  `tsm_modifDisque` float NOT NULL,
  `tsm__user` varchar(32) NOT NULL,
  `tsm_date_crea` datetime NOT NULL,
  PRIMARY KEY (`IdTsm`),
  UNIQUE KEY `PersonTransicsID` (`PersonTransicsID`,`tsm_date`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=15298 ;

-- --------------------------------------------------------

--
-- Structure de la table `t_type_at_tpa`
--

CREATE TABLE IF NOT EXISTS `t_type_at_tpa` (
  `IdTypeAt` int(11) NOT NULL AUTO_INCREMENT,
  `tpa_libelle` varchar(32) CHARACTER SET latin1 NOT NULL,
  `tpa_code` varchar(4) DEFAULT NULL COMMENT 'Edition si non null',
  `tpa_duree` int(11) NOT NULL,
  `tpa_couleur` varchar(8) CHARACTER SET latin1 NOT NULL,
  `tpa_dateCrea` datetime NOT NULL,
  `tpaUserCrea` varchar(32) CHARACTER SET latin1 NOT NULL,
  `tpa_dateAnnule` datetime DEFAULT NULL,
  PRIMARY KEY (`IdTypeAt`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=13 ;

-- --------------------------------------------------------

--
-- Structure de la table `t_vehicle`
--

CREATE TABLE IF NOT EXISTS `t_vehicle` (
  `VehicleTransicsID` int(11) NOT NULL,
  `VehicleID` varchar(8) NOT NULL,
  `VehicleExternalCode` varchar(8) NOT NULL,
  `LicensePlate` varchar(16) NOT NULL,
  `Category` varchar(16) NOT NULL,
  `AutoFilter` varchar(32) NOT NULL,
  `ChassisNumber` varchar(32) DEFAULT NULL,
  `CurrentKms` int(11) NOT NULL,
  `vh_dateImport` datetime NOT NULL,
  PRIMARY KEY (`VehicleTransicsID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COMMENT='Tracteurs';

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
