import axios from 'axios';
import { Injectable } from '@nestjs/common';
import 'dotenv/config';

const IMP_API_KEY = process.env.IMP_API_KEY;
const IMP_API_SECRET = process.env.IMP_API_SECRET;

@Injectable()
export class IamportService {
  async getToken(): Promise<string> {
    const token = await axios({
      url: 'https://api.iamport.kr/users/getToken',
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      data: {
        imp_key: IMP_API_KEY,
        imp_secret: IMP_API_SECRET,
      },
    });
    const { access_token }: { access_token: string } = token.data.response;
    return access_token;
  }

  async getInfo({
    access_token,
    impUid,
  }: {
    access_token: string;
    impUid: string;
  }): Promise<any> {
    const getPaymentData = await axios({
      url: `https://api.iamport.kr/payments/${impUid}`,
      method: 'get',
      headers: { Authorization: access_token },
    });
    return getPaymentData.data.response;
  }

  async cancel({
    access_token,
    impUid,
    amount,
  }: {
    access_token: string;
    impUid: string;
    amount: number;
  }): Promise<any> {
    const getCancelData = await axios({
      url: 'https://api.iamport.kr/payments/cancel',
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: access_token,
      },
      data: {
        imp_uid: impUid,
        amount,
      },
    });
    const { response } = getCancelData.data;
    return response;
  }
}
