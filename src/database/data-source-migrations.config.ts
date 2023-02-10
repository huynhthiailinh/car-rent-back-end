import { DataSource } from 'typeorm';
import { dataSource } from './data-source';

export default new DataSource({
  ...dataSource,
  entities: [__dirname + './../**/*.entity.{ts,js}'],
  migrations: [__dirname + './migrations/*.{ts,js}'],
  migrationsTableName: 'migrations',
});
