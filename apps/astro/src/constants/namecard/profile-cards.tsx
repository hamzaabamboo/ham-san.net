import { Center, Grid, GridItem, HStack, Stack, styled } from 'styled-system/jsx';
import akarinLogo from '../../assets/namecard/akarin-logo.png';
import ashPng from '../../assets/namecard/ash.png';
import hasuMember01Icon from '../../assets/namecard/hasu-member-01-icon.png';
import honoshi from '../../assets/namecard/honoshi.png';
import polkaKoushou from '../../assets/namecard/polka-koushou.png';
import polkaLogo3 from '../../assets/namecard/polka-logo3.png';
import polkaMember01 from '../../assets/namecard/polka-member-01.png';
import polkaQr from '../../assets/namecard/polka-qr.png';
import polka from '../../assets/namecard/polka.png';
import { ProfileText } from './text-primitives';
import type { ProfileNamecardData } from './types';

export const PROFILE_NAMECARDS: ProfileNamecardData[] = [
  {
    variant: 'polka-new',
    color: '#305483',
    theme: 'profile',
    logos: {
      top: polkaKoushou.src,
      middle: polkaMember01.src,
      bottom: polkaLogo3.src
    },
    profile: {
      accentColor: '#1F1F5A',
      cornerStripeColors: ['#fbe67c', '#ef701c', '#ba2635', '#f8b500'],
      front: {
        title: 'PROFILE CARD',
        footer: '©IKZL',
        person: {
          name: 'ハムP',
          birthday: '6/13',
          location: '東京（タイ出身だよ）',
          oshi: '高橋ポルカ',
          message:
            'サワディーカー（はじめまして)！\nわたしハムPというんだ\n女性声優の推し活をするため、\n日本にやって来ました！\n仲良くしてください！！！！'
        },
        illustration: {
          src: polka.src,
          props: {
            style: {
              scale: 1.5,
              bottom: '1mm',
              right: '5mm',
              filter: 'saturate(1.25) brightness(1.25)'
            }
          }
        }
      },
      back: {
        title: 'PROFILE CARD',
        footer: () => (
          <HStack>
            <styled.p>
              X (旧: Twitter): <b>@HamP_punipuni</b>
            </styled.p>
            <styled.p>
              Discord: <b>HamP</b>
            </styled.p>
          </HStack>
        ),
        backTop: () => (
          <HStack justifyContent="space-between" width="100%">
            <Stack gap="0">
              <ProfileText fontSize="3mm">推し:</ProfileText>
              <Grid
                gridTemplateColumns="repeat(3,1fr)"
                gridRowGap="0"
                gridColumnGap="0"
                width="fit-content"
                fontSize="3mm"
              >
                <HStack gap="1mm" alignItems="center">
                  <styled.img
                    src={polkaMember01.src}
                    objectFit="contain"
                    width="3mm"
                    height="3mm"
                  />
                  <ProfileText color="#fbe67c" fontSize="3mm">
                    綾咲穂音
                  </ProfileText>
                </HStack>
                <HStack gap="1mm" alignItems="center">
                  <styled.img
                    src={hasuMember01Icon.src}
                    objectFit="contain"
                    width="3mm"
                    height="3mm"
                  />
                  <ProfileText color="#f8b500" fontSize="3mm">
                    楡井希実
                  </ProfileText>
                </HStack>
                <ProfileText color="#ef701c" fontSize="3mm">
                  百瀬安由未
                </ProfileText>
                <HStack gap="1mm" alignItems="center">
                  <styled.img src={ashPng.src} objectFit="contain" width="3mm" height="3mm" />
                  <ProfileText color="#ba2635" fontSize="3mm">
                    佐々木琴子
                  </ProfileText>
                </HStack>
                <HStack gap="1mm" alignItems="center">
                  <styled.img src={akarinLogo.src} objectFit="contain" width="3mm" height="3mm" />
                  <ProfileText fontSize="3mm">鬼頭明里</ProfileText>
                </HStack>
              </Grid>
            </Stack>
            <Stack justifyContent="center">
              <styled.img src={polkaQr.src} w="13mm" h="13mm" />
            </Stack>
          </HStack>
        ),
        message: ''
      }
    }
  },
  {
    variant: 'Honoshi',
    color: '#305483',
    theme: 'profile',
    logos: {
      top: polkaKoushou.src,
      bottom: polkaLogo3.src
    },
    profile: {
      accentColor: '#305483',
      cornerStripeColors: ['#79aedd', '#9ad68b', '#f1b167', '#79aedd'],
      front: {
        title: 'PROFILE CARD',
        footer: () => (
          <HStack>
            <styled.p>
              X (旧: Twitter): <b>@HamP_punipuni</b>
            </styled.p>
            <styled.p>
              Discord: <b>HamP</b>
            </styled.p>
          </HStack>
        ),
        person: {
          name: '綾咲穂音',
          birthday: '12/31',
          location: '日本',
          oshi: '',
          // message:
          //   '中学時代は数学が苦手すぎて困りすぎたあげく、\nこの学校を見つけられてとりあえず\nホッとしています！\nもし同じような人いたら友達になって\nください!!'
          message: () => (
            <styled.div width="100%" fontSize="3mm" textAlign="center">
              仲良くしてください！！！！
            </styled.div>
          )
        },
        illustration: {
          src: honoshi.src
        }
      },
      back: {
        title: 'PROFILE CARD',
        footer: () => (
          <HStack>
            <styled.p>
              X (旧: Twitter): <b>@HamP_punipuni</b>
            </styled.p>
            <styled.p>
              Discord: <b>HamP</b>
            </styled.p>
          </HStack>
        ),
        backTop: (
          <HStack justifyContent="space-between" alignItems="center">
            <Grid
              flex="1"
              rowGap="1mm"
              columnGap="2mm"
              alignItems="center"
              gridTemplateColumns="max-content max-content max-content minmax(0,1fr)"
              gridTemplateRows="repeat(2,minmax(0,auto))"
              minW="0"
            >
              <GridItem>
                <ProfileText>名前</ProfileText>
              </GridItem>
              <GridItem minW="0">
                <ProfileText fontSize="3mm">ハムP</ProfileText>
              </GridItem>

              <GridItem>
                <ProfileText>推し</ProfileText>
              </GridItem>
              <GridItem rowSpan={2} minW="0">
                <ProfileText style={{ whiteSpace: 'normal', lineHeight: '1.15' }} fontSize="3mm">
                  綾咲穂音、楡井希実、
                  <br /> 百瀬安由未、佐々木琴子、
                  <br />
                  鬼頭明里
                </ProfileText>
              </GridItem>
              <GridItem>
                <ProfileText>誕生日</ProfileText>
              </GridItem>
              <GridItem minW="0">
                <ProfileText fontSize="3mm">6/13</ProfileText>
              </GridItem>
            </Grid>
            <Stack justifyContent="center">
              <styled.img src={polkaQr.src} w="13mm" h="13mm" />
            </Stack>
          </HStack>
        ),
        message: () => (
          <Center width="100%" textAlign="center">
            <ProfileText fontSize="5mm">
              アニメ、アニメ
              <br />
              ジョセイセイユウ！！
            </ProfileText>
          </Center>
        )
      }
    }
  }
];
