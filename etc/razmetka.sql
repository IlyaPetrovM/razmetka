SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `FragmentText`;
DROP TABLE IF EXISTS `FragmentMedia`;
DROP TABLE IF EXISTS `Interview`;
DROP TABLE IF EXISTS `Track`;
SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE `FragmentText` (
    `id` INT AUTO_INCREMENT NOT NULL,
    `start_s` FLOAT NOT NULL,
    `end_s` FLOAT NOT NULL,
    `descr` VARCHAR(2048) NOT NULL,
    `media_id` INT NOT NULL,
    `track_id` INT NOT NULL,
    `int_id` INT NOT NULL,
    PRIMARY KEY (`id`)
);

CREATE TABLE `FragmentMedia` (
    `id` INT AUTO_INCREMENT NOT NULL,
    `start_s` FLOAT NOT NULL,
    `end_s` FLOAT NOT NULL,
    `path` VARCHAR(255) NOT NULL,
    `int_id` INT NOT NULL,
    `track_id` INT NOT NULL,
    PRIMARY KEY (`id`)
);

CREATE TABLE `Interview` (
    `id` INT AUTO_INCREMENT NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `_date` DATE NOT NULL,
    PRIMARY KEY (`id`)
);

CREATE TABLE `Track` (
    `id` INT AUTO_INCREMENT NOT NULL,
    `_type` CHAR(10) NOT NULL,
    `title` VARCHAR(127) NOT NULL,
    `int_id` INT NOT NULL,
    PRIMARY KEY (`id`)
);

ALTER TABLE `FragmentText` ADD FOREIGN KEY (`int_id`) REFERENCES `Interview`(`id`);
ALTER TABLE `FragmentText` ADD FOREIGN KEY (`media_id`) REFERENCES `Track`(`id`);
ALTER TABLE `FragmentText` ADD FOREIGN KEY (`track_id`) REFERENCES `Track`(`id`);
ALTER TABLE `FragmentMedia` ADD FOREIGN KEY (`int_id`) REFERENCES `Interview`(`id`);
ALTER TABLE `FragmentMedia` ADD FOREIGN KEY (`track_id`) REFERENCES `Interview`(`id`);
ALTER TABLE `Track` ADD FOREIGN KEY (`int_id`) REFERENCES `Interview`(`id`);