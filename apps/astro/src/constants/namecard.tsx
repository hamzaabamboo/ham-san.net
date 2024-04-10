import { styled } from 'styled-system/jsx';
import akarinLogo from '../assets/namecard/akarin-logo.png';
import akarinQrCode from '../assets/namecard/akarin-qr-code.png';
import hasuLogo from '../assets/namecard/hasu-logo.jpg';
import hasuQrCode from '../assets/namecard/hasu-qr-code.png';

export const NAMECARDS = [
  {
    variant: 'default',
    color: '#1F1F5A',
    content: {
      firstRow: 'Smiley Light Village',
      secondRow: '鬼頭明里の里民、タイ支部 🇹🇭',
      name: 'ハムP',
      nameSubtitle: 'はむぴー／HamP',
      message: 'สวัสดีครับ!（サワディーカー）'
    },
    logoTop: akarinLogo.src,
    logoBottom:
      'https://500ddaf7f3cefcd23a892c355a3d13d0.cdnext.stream.ne.jp/images/common/logo.svg',
    qrCode: akarinQrCode.src,
    Quote: () => {
      return (
        <styled.blockquote textAlign="center" fontSize="xs" fontStyle="italic">
          「…推しって<b>“応援する存在”</b>というよりも、
          <br />
          <b>“自分のモチベーションを高める存在”</b>…」
          <br />ー 鬼頭明里
        </styled.blockquote>
      );
    }
  },
  {
    variant: 'kaho',
    color: '#f8b500',
    content: {
      firstRow: 'HASUNOSORA JOGAKUIN SCHOOL IDOL CLUB',
      secondRow: '蓮ノ空のこと好き好きクラブのみなさん',
      name: 'ハムP',
      nameSubtitle: 'はむぴー／HamP',
      message: 'สวัสดีครับ!（サワディーカー）'
    },
    logoTop: hasuLogo.src,
    logoMiddle: 'https://www.lovelive-anime.jp/hasunosora/shared/img/member/01_icon.png',
    logoBottom: 'https://www.lovelive-anime.jp/hasunosora/shared/img/common/hd_logo.svg',
    qrCode: hasuQrCode.src,
    Quote: () => {
      return (
        <styled.blockquote textAlign="center" fontSize="xs" fontStyle="italic">
          「フラワー」
          <br />ー 楡井希実
        </styled.blockquote>
      );
    }
  }
];

export type NamecardData = (typeof NAMECARDS)[0];
