import { SegmentGroup } from '~/components/ui/segment-group';
import { Languages } from '~/i18n/ui';
import { useTranslations } from '~/i18n/utils';

export const AboutMeIndex = ({ locale }: { locale: Languages }) => {
  const t = useTranslations(locale);

  const options = [
    { id: 'introduction', label: t('about-me.title') },
    { id: 'skills', label: t('about-me.skills') },
    { id: 'experiences', label: t('common.experiences') },
    { id: 'education', label: t('common.education') }
  ];

  return (
    <SegmentGroup.Root>
      {options.map((option) => (
        <SegmentGroup.Item key={option.id} value={option.id} disabled={option.id === 'premium'}>
          <SegmentGroup.ItemControl />
          <SegmentGroup.ItemText>{option.label}</SegmentGroup.ItemText>
          <SegmentGroup.ItemHiddenInput />
        </SegmentGroup.Item>
      ))}
      <SegmentGroup.Indicator />
    </SegmentGroup.Root>
  );
};
