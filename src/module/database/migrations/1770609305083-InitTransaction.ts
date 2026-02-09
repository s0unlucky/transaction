import { MigrationInterface, QueryRunner } from 'typeorm';

export class $InitTransaction1770609305083 implements MigrationInterface {
  name = ' $InitTransaction1770609305083';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."transaction_type_enum" AS ENUM('WITHDRAW', 'DEPOSIT', 'TRANSFER')`,
    );
    await queryRunner.query(
      `CREATE TABLE "transaction" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "transaction_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" character varying NOT NULL, "amount" character varying NOT NULL, "type" "public"."transaction_type_enum" NOT NULL, CONSTRAINT "PK_6e02e5a0a6a7400e1c944d1e946" PRIMARY KEY ("transaction_id")); COMMENT ON COLUMN "transaction"."transaction_id" IS 'Индентификатор транзакции'; COMMENT ON COLUMN "transaction"."userId" IS 'Индентификатор пользователя, совершающего транзакцию'; COMMENT ON COLUMN "transaction"."amount" IS 'Сумма транзакций в копейках'; COMMENT ON COLUMN "transaction"."type" IS 'Тип транзакции'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "transaction"`);
    await queryRunner.query(`DROP TYPE "public"."transaction_type_enum"`);
  }
}
