import { Stack, styled } from 'styled-system/jsx';
import akarinLogo from '../assets/namecard/akarin-logo.png';
import akarinQrCode from '../assets/namecard/akarin-qr-code.png';
import ashQrCode from '../assets/namecard/ash-qr-code.png';
import ash from '../assets/namecard/ash.webp';
import hasuLogo from '../assets/namecard/hasu-logo.jpg';
import hasuQrCode from '../assets/namecard/hasu-qr-code.png';

// QRCode from https://www.qrcode-monkey.com/
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
        <Stack gap={0}>
          {' '}
          <styled.blockquote textAlign="center" fontSize="xs" fontStyle="italic">
            「…光を、雨を、風を、
            <styled.span fontWeight="bold">待ってるだけじゃない！</styled.span>
            <br />
            あたしはあたしの力で、
            <styled.span fontWeight="bold">咲いててみせる！</styled.span>… 」
          </styled.blockquote>
          <styled.blockquote textAlign="center" fontSize="xs" fontStyle="italic">
            「はい、笑って笑って。
            <styled.span color="var(--main-color)" fontSize="md" fontWeight="bold">
              フラワー
            </styled.span>
            」<br /> ー 日野下花帆（CV:楡井希実）
          </styled.blockquote>
        </Stack>
      );
    }
  },
  {
    variant: 'ktk',
    color: '#6a6c6d',
    content: {
      firstRow: '株式会社アッシュ',
      secondRow: 'アッシュくんの爪研ぎ、タイ支部 🇹🇭',
      name: 'ハムP',
      nameSubtitle: 'はむぴー／HamP',
      message: 'สวัสดีครับ!（サワディーカー）'
    },
    logoBottom: ash.src,
    qrCode: ashQrCode.src,
    Quote: () => {
      return (
        <Stack gap={0}>
          <styled.blockquote textAlign="center" fontSize="xs" fontStyle="italic">
            「にゃにゃにゃ〜にゃん、<b>にゃん</b>にゃにゃん」 <br />ー アッシュくん
          </styled.blockquote>
        </Stack>
      );
    }
  }
];

export type NamecardData = (typeof NAMECARDS)[0];
