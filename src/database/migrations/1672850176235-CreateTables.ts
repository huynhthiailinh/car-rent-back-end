import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTables1672850176235 implements MigrationInterface {
  name = 'CreateTables1672850176235';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`orders\` (\`id\` varchar(36) NOT NULL, \`deleted_at\` timestamp(6) NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`billing_name\` varchar(255) NULL, \`user_id\` varchar(255) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`cities\` (\`id\` varchar(36) NOT NULL, \`deleted_at\` timestamp(6) NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`name\` varchar(255) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`users\` (\`id\` varchar(36) NOT NULL, \`deleted_at\` timestamp(6) NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`email\` varchar(255) NULL, \`hashed_password\` varchar(255) NULL, \`full_name\` varchar(255) NULL, \`phone_number\` varchar(255) NULL, \`address\` varchar(255) NULL, \`city_id\` varchar(255) NULL, \`occupation\` varchar(255) NULL, \`verified_at\` timestamp NULL, \`cityId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`tokens\` (\`id\` varchar(36) NOT NULL, \`deleted_at\` timestamp(6) NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`token\` varchar(255) NULL, \`type\` enum ('ACCESS_TOKEN', 'REFRESH_TOKEN') NULL, \`expired_at\` timestamp NULL, \`user_id\` varchar(255) NULL, \`userId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`languages\` (\`id\` varchar(36) NOT NULL, \`deleted_at\` timestamp(6) NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`code\` varchar(255) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`cars\` (\`id\` varchar(36) NOT NULL, \`deleted_at\` timestamp(6) NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`capacity\` int NULL, \`gasoline\` int NULL, \`new_price\` int NULL, \`old_price\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`car_languages\` (\`id\` varchar(36) NOT NULL, \`deleted_at\` timestamp(6) NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`language_code\` varchar(255) NULL, \`car_id\` varchar(255) NULL, \`name\` varchar(255) NULL, \`description\` varchar(255) NULL, \`steering\` enum ('MANUAL', 'ELECTRIC', 'THƯỜNG', 'TỰ ĐỘNG') NULL, \`languageCode\` varchar(255) NULL, \`carId\` varchar(36) NULL, FULLTEXT INDEX \`IDX_a372c1b52f391a6385f5fae17d\` (\`name\`), INDEX \`IDX_a925da84f7796189c7ec5e4988\` (\`language_code\`, \`car_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_a925da84f7796189c7ec5e4988\` ON \`car_languages\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_a372c1b52f391a6385f5fae17d\` ON \`car_languages\``,
    );
    await queryRunner.query(`DROP TABLE \`car_languages\``);
    await queryRunner.query(`DROP TABLE \`cars\``);
    await queryRunner.query(`DROP TABLE \`languages\``);
    await queryRunner.query(`DROP TABLE \`tokens\``);
    await queryRunner.query(`DROP TABLE \`users\``);
    await queryRunner.query(`DROP TABLE \`cities\``);
    await queryRunner.query(`DROP TABLE \`orders\``);
  }
}
