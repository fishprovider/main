import storeUser from '@fishprovider/cross/dist/stores/user';

import { langs } from '~constants/translation';
import { useTranslation } from '~libs/translation';
import Select from '~ui/core/Select';

function LangSelector() {
  const { i18n } = useTranslation();

  const userLang = storeUser.useStore((state) => state.lang);

  return (
    <Select
      value={userLang}
      onChange={(value) => {
        if (!value) return;
        const newLang = value;
        Logger.info('newLang', newLang);
        i18n.changeLanguage(newLang);
        storeUser.mergeState({ lang: newLang });
      }}
      data={langs.map((lang) => ({
        value: lang.key,
        label: `${lang.flag} ${lang.title}`,
      }))}
      size="xs"
      w={120}
    />
  );
}

export default LangSelector;
