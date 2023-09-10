import { useEffect } from 'react';

import useOnMount from '~hooks/useOnMount';
import useScript from '~hooks/useScript';
import Group from '~ui/core/Group';
import Icon from '~ui/core/Icon';

const divId = 'google_translate_element';
const scriptId = 'google-translate';
const scriptUrl = 'https://translate.google.com/translate_a/element.js';

const ggTranslateClass = 'skiptranslate';

function useGGTranslate() {
  const isUsed = useOnMount(
    () => !!document.querySelector(`div[class=${ggTranslateClass}]:not([style*="display: none"])`),
  );
  return isUsed;
}

const getGGTranslateWidget = () => document.querySelector('div[class=\'skiptranslate goog-te-gadget\']');

function GGTranslate() {
  useScript(scriptId, scriptUrl);

  const isFoundGGTranslate = useOnMount(() => !!window.google?.translate?.TranslateElement);
  const isFoundGGTranslateWidget = useOnMount(() => !!getGGTranslateWidget());

  useEffect(() => {
    Logger.info('GGTranslate loaded', isFoundGGTranslate);
    if (isFoundGGTranslate) {
      window.google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          autoDisplay: false,
        },
        divId,
      );
    }
  }, [isFoundGGTranslate]);

  useEffect(() => {
    if (isFoundGGTranslateWidget) {
      const widget = getGGTranslateWidget();
      if (widget) {
        widget.childNodes[2]?.remove();
        widget.childNodes[1]?.remove();
        // @ts-ignore skip html
        const style = widget.firstChild?.firstChild?.style;
        if (style) {
          style.height = '30px';
        }
      }
    }
  }, [isFoundGGTranslateWidget]);

  return (
    <Group align="center">
      <Icon name="Language" color="gray" />
      <div id={divId} />
    </Group>
  );
}

export default GGTranslate;

export {
  useGGTranslate,
};
