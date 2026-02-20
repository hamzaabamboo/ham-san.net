import { Stack, styled } from 'styled-system/jsx';
import type { ReactNode } from 'react';
import akarinLogo from '../assets/namecard/akarin-logo.png';
import akarinQrCode from '../assets/namecard/akarin-qr-code.png';
import ashQrCode from '../assets/namecard/ash-qr-code.png';
import ash from '../assets/namecard/ash.webp';
import hasuHdLogo from '../assets/namecard/hasu-hd-logo.png';
import hasuLogo from '../assets/namecard/hasu-logo.jpg';
import hasuMember01Icon from '../assets/namecard/hasu-member-01-icon.png';
import hasuQrCode from '../assets/namecard/hasu-qr-code.png';
import honoshi from '../assets/namecard/honoshi.png';
import polkaKoushou from '../assets/namecard/polka-koushou.png';
import polkaLogo3 from '../assets/namecard/polka-logo3.png';
import polkaMember01 from '../assets/namecard/polka-member-01.png';

type NamecardProfileLabels = {
  name?: string;
  birthday?: string;
  location?: string;
  oshi?: string;
  message?: string;
};

type NamecardProfilePerson = {
  name: string;
  birthday: string;
  location: string;
  oshi: string;
  message: string;
};

type NamecardProfileIllustration = {
  src: string;
};

type NamecardProfileFace = {
  title?: string;
  brand?: string;
  footer?: string;
  labels?: NamecardProfileLabels;
  person?: Partial<NamecardProfilePerson>;
  message?: string;
  illustration?: NamecardProfileIllustration;
  showBrand?: boolean;
  showFooter?: boolean;
  showValues?: boolean;
};

type NamecardProfile = {
  accentColor?: string;
  front: NamecardProfileFace;
  back?: NamecardProfileFace;
};

export type NamecardData = {
  variant: string;
  color: string;
  content: {
    firstRow: string;
    secondRow: string;
    name: string;
    nameSubtitle: string;
    message: string;
  };
  logoTop?: string;
  logoMiddle?: string;
  logoBottom: string;
  qrCode: string;
  Quote: () => ReactNode;
  style?: 'default' | 'profile';
  profile?: NamecardProfile;
};

// QRCode from https://www.qrcode-monkey.com/
export const NAMECARDS: NamecardData[] = [
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
        <styled.blockquote fontSize="xs" textAlign="center" fontStyle="italic">
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
    logoMiddle: hasuMember01Icon.src,
    logoBottom: hasuHdLogo.src,
    qrCode: hasuQrCode.src,
    Quote: () => {
      return (
        <Stack gap={0}>
          {' '}
          <styled.blockquote fontSize="xs" textAlign="center" fontStyle="italic">
            「…光を、雨を、風を、
            <styled.span fontWeight="bold">待ってるだけじゃない！</styled.span>
            <br />
            あたしはあたしの力で、
            <styled.span fontWeight="bold">咲いててみせる！</styled.span>… 」
          </styled.blockquote>
          <styled.blockquote fontSize="xs" textAlign="center" fontStyle="italic">
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
          <styled.blockquote fontSize="xs" textAlign="center" fontStyle="italic">
            「にゃにゃにゃ〜にゃん、<b>にゃん</b>にゃにゃん」 <br />ー アッシュくん
          </styled.blockquote>
        </Stack>
      );
    }
  },
  {
    variant: 'polka',
    color: '#fbe67c',
    content: {
      firstRow: 'Love学院高等学校',
      secondRow: 'L高生、バンコクサテライト 🇹🇭',
      name: 'ハムP',
      nameSubtitle: 'はむぴー／HamP',
      message: 'สวัสดีครับ!（サワディーカー）'
    },
    logoTop: polkaKoushou.src,
    logoMiddle: polkaMember01.src,
    logoBottom: polkaLogo3.src,
    qrCode: ashQrCode.src,
    Quote: () => {
      return (
        <Stack gap={0}>
          <styled.blockquote fontSize="xs" textAlign="center" fontStyle="italic">
            「嬉しくなると踊っちゃう～」 <br />
            「敗けたって次はある」 <br />ー 高橋ポルカ
          </styled.blockquote>
        </Stack>
      );
    }
  },
  {
    variant: 'polka-new',
    color: '#305483',
    style: 'profile',
    profile: {
      accentColor: '#305483',
      front: {
        title: 'PROFILE CARD',
        footer: '©IKZL',
        person: {
          name: '高橋ポルカ',
          birthday: '8/18',
          location: '浅草',
          oshi: '高橋ポルカ',
          message: '中学時代は数学が苦手すぎて困りすぎたあげく、\nこの学校を見つけられてとりあえずホッとしています！\nもし同じような人いたら友達になってください!!'
        },
        illustration: {
          src: honoshi.src
        },
        showBrand: false
      },
      back: {
        title: 'PROFILE CARD',
        brand: 'What is my ?',
        footer: '©IKZL',
        person: {
          name: '高橋ポルカ',
          birthday: '8/18',
          oshi: '高橋ポルカ'
        },
        message: '',
        showBrand: true,
        showValues: false
      }
    },
    content: {
      firstRow: 'Love学院高等学校',
      secondRow: 'L高生、バンコクサテライト 🇹🇭',
      name: 'ハムP',
      nameSubtitle: 'はむぴー／HamP',
      message: 'สวัสดีครับ!（サワディーカー）'
    },
    logoTop: polkaKoushou.src,
    logoMiddle: polkaMember01.src,
    logoBottom: polkaLogo3.src,
    qrCode: ashQrCode.src,
    Quote: () => {
      return (
        <Stack gap={0}>
          <styled.blockquote fontSize="xs" textAlign="center" fontStyle="italic">
            「嬉しくなると踊っちゃう～」 <br />
            「敗けたって次はある」 <br />ー 高橋ポルカ
          </styled.blockquote>
        </Stack>
      );
    }
  }
];
