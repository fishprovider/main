import { langs } from '~constants/translation';
import { updateUserInfoController, watchUserInfoController } from '~controllers/user.controller';
import { useTranslation } from '~libs/translation';
import Select from '~ui/core/Select';

function LangSelector() {
  const { i18n } = useTranslation();

  const userLang = watchUserInfoController((state) => state.lang);

  return (
    <Select
      value={userLang}
      onChange={(value) => {
        if (!value) return;
        const newLang = value;
        Logger.info('newLang', newLang);
        i18n.changeLanguage(newLang);
        updateUserInfoController({ lang: newLang });
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
