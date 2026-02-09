/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { ChangeBalanceParams } from "./account.types";

@Injectable()
export class InternalAccountService {
  constructor(
    private readonly config: ConfigService,
    private readonly httpService: HttpService,
) {}

async changeBalance(
  params: ChangeBalanceParams,
): Promise<void> {
  const url = `${this.config.get('ACCOUNT_URL')}/user/balance`;
  const res = await this.httpService.axiosRef.post(url, params);

  return res.data;
  }
}