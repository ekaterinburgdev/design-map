import Typograf from "typograf";

const tp = new Typograf({ locale: ['ru', 'en-US'] });

tp.disableRule([
  'common/space/delBeforePunctuation',
  'common/space/afterPunctuation',
  'common/nbsp/replaceNbsp',
]);

export default function typographText(text) {
  if (!text) {
    return null;
  }

  try {
    return tp.execute(text) || '';
  } catch (e) {
    return null;
  }
}
