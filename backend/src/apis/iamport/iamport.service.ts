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
      method: 'post', // POST method
      headers: { 'Content-Type': 'application/json' }, // "Content-Type": "application/json"
      data: {
        imp_key: IMP_API_KEY, // REST API 키
        imp_secret: IMP_API_SECRET, // REST API Secret
      },
    });
    const { access_token } = token.data.response; // 인증 토큰
    return access_token;
  }

  async getInfo({ access_token, impUid }) {
    // imp_uid로 아임포트 서버에서 결제 정보 조회
    const getPaymentData = await axios({
      url: `https://api.iamport.kr/payments/${impUid}`, // imp_uid 전달
      method: 'get', // GET method
      headers: { Authorization: access_token }, // 인증 토큰 Authorization header에 추가
    });
    return getPaymentData.data.response; // 조회한 결제 정보
  }

  async cancel({ access_token, impUid, amount }) {
    const getCancelData = await axios({
      url: 'https://api.iamport.kr/payments/cancel',
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: access_token, // 아임포트 서버로부터 발급받은 엑세스 토큰
      },
      data: {
        imp_uid: impUid, // imp_uid를 환불 `unique key`로 입력
        amount, // 가맹점 클라이언트로부터 받은 환불금액
      },
    });
    const { response } = getCancelData.data; // 환불 결과
    return response;
  }
}
