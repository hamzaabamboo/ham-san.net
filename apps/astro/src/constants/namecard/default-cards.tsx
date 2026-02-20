import { Stack, styled } from 'styled-system/jsx';
import akarinLogo from '../../assets/namecard/akarin-logo.png';
import akarinQrCode from '../../assets/namecard/akarin-qr-code.png';
import ashQrCode from '../../assets/namecard/ash-qr-code.png';
import ash from '../../assets/namecard/ash.webp';
import hasuHdLogo from '../../assets/namecard/hasu-hd-logo.png';
import hasuLogo from '../../assets/namecard/hasu-logo.jpg';
import hasuMember01Icon from '../../assets/namecard/hasu-member-01-icon.png';
import hasuQrCode from '../../assets/namecard/hasu-qr-code.png';
import polkaKoushou from '../../assets/namecard/polka-koushou.png';
import polkaLogo3 from '../../assets/namecard/polka-logo3.png';
import polkaMember01 from '../../assets/namecard/polka-member-01.png';
import polkaQr from '../../assets/namecard/polka-qr.png';
import {
  createContactContent,
  createDefaultBackMainContent,
  createDefaultFrontMainContent,
  createDefaultFrontRailContent
} from './content';
import type { DefaultNamecardData } from './types';

const defaultContacts = createContactContent('@HamP_punipuni', 'HamP');

export const DEFAULT_NAMECARDS: DefaultNamecardData[] = [
  {
    variant: 'default',
    color: '#1F1F5A',
    theme: 'default',
    content: {
      frontMain: createDefaultFrontMainContent({
        firstRow: 'Smiley Light Village',
        secondRow: '鬼頭明里の里民、タイ支部 🇹🇭',
        name: 'ハムP',
        nameSubtitle: 'はむぴー／HamP',
        message: 'สวัสดีครับ!（サワディーカー）',
        contacts: defaultContacts
      }),
      frontRail: createDefaultFrontRailContent({
        topLogo: akarinLogo.src,
        bottomLogo:
          'https://500ddaf7f3cefcd23a892c355a3d13d0.cdnext.stream.ne.jp/images/common/logo.svg'
      }),
      backMain: createDefaultBackMainContent({
        qrCode: akarinQrCode.src,
        quote: (
          <styled.blockquote fontSize="xs" textAlign="center" fontStyle="italic">
            「…推しって<b>“応援する存在”</b>というよりも、
            <br />
            <b>“自分のモチベーションを高める存在”</b>…」
            <br />ー 鬼頭明里
          </styled.blockquote>
        )
      })
    }
  },
  {
    variant: 'kaho',
    color: '#f8b500',
    theme: 'default',
    content: {
      frontMain: createDefaultFrontMainContent({
        firstRow: 'HASUNOSORA JOGAKUIN SCHOOL IDOL CLUB',
        secondRow: '蓮ノ空のこと好き好きクラブのみなさん',
        name: 'ハムP',
        nameSubtitle: 'はむぴー／HamP',
        message: 'สวัสดีครับ!（サワディーカー）',
        contacts: defaultContacts
      }),
      frontRail: createDefaultFrontRailContent({
        topLogo: hasuLogo.src,
        middleLogo: hasuMember01Icon.src,
        bottomLogo: hasuHdLogo.src
      }),
      backMain: createDefaultBackMainContent({
        qrCode: hasuQrCode.src,
        quote: (
          <Stack gap={0}>
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
        )
      })
    }
  },
  {
    variant: 'ktk',
    color: '#6a6c6d',
    theme: 'default',
    content: {
      frontMain: createDefaultFrontMainContent({
        firstRow: '株式会社アッシュ',
        secondRow: 'アッシュくんの爪研ぎ、タイ支部 🇹🇭',
        name: 'ハムP',
        nameSubtitle: 'はむぴー／HamP',
        message: 'สวัสดีครับ!（サワディーカー）',
        contacts: defaultContacts
      }),
      frontRail: createDefaultFrontRailContent({
        bottomLogo: ash.src
      }),
      backMain: createDefaultBackMainContent({
        qrCode: ashQrCode.src,
        quote: (
          <Stack gap={0}>
            <styled.blockquote fontSize="xs" textAlign="center" fontStyle="italic">
              「にゃにゃにゃ〜にゃん、<b>にゃん</b>にゃにゃん」 <br />ー アッシュくん
            </styled.blockquote>
          </Stack>
        )
      })
    }
  },
  {
    variant: 'polka',
    color: '#fbe67c',
    theme: 'default',
    content: {
      frontMain: createDefaultFrontMainContent({
        firstRow: 'Love学院高等学校',
        secondRow: 'L高生、バンコクサテライト 🇹🇭',
        name: 'ハムP',
        nameSubtitle: 'はむぴー／HamP',
        message: 'สวัสดีครับ!（サワディーカー）',
        contacts: defaultContacts
      }),
      frontRail: createDefaultFrontRailContent({
        topLogo: polkaKoushou.src,
        middleLogo: polkaMember01.src,
        bottomLogo: polkaLogo3.src
      }),
      backMain: createDefaultBackMainContent({
        qrCode: polkaQr.src,
        quote: (
          <Stack gap={0}>
            <styled.blockquote fontSize="xs" textAlign="center" fontStyle="italic">
              「嬉しくなると踊っちゃう～」 <br />
              「敗けたって次はある」 <br />ー 高橋ポルカ
            </styled.blockquote>
          </Stack>
        )
      })
    }
  }
];
