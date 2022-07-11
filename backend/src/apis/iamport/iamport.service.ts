import axios from 'axios';
import { Injectable } from '@nestjs/common';
import 'dotenv/config';

const IMP_API_KEY = process.env.IMP_API_KEY;
const IMP_API_SECRET = process.env.IMP_API_SECRET;

@Injectable()
export class IamportService {
  async getToken() {
    const token = await axios({
      url: 'https://api.iamport.kr/users/getToken',
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      data: {
        imp_key: IMP_API_KEY,
        imp_secret: IMP_API_SECRET,
      },
    });
    const { access_token } = token.data.response;
    return access_token;
  }

  async getInfo({ access_token, impUid }) {
    // imp_uid로 아임포트 서버에서 결제 정보 조회
    const getPaymentData = await axios({
      url: `https://api.iamport.kr/payments/${impUid}`,
      method: 'get',
      headers: { Authorization: access_token },
    });
    return getPaymentData.data.response;
  }

  async cancel({ access_token, impUid, amount }) {
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
