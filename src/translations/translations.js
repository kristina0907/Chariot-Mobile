import i18n from "i18n-js";
 import ru from '../translations/ru.json';
 import en from '../translations/en.json';
 import vi from '../translations/vi.json';
 import { authenticationService } from '../services';

 i18n.fallbacks = true; // If an English translation is not available in en.js, it will look inside hi.js
 i18n.missingBehaviour = 'guess'; // It will convert HOME_noteTitle to "HOME note title" if the value of HOME_noteTitle doesn't exist in any of the translation files.
 i18n.defaultLocale = 'ru'; // If the current locale in device is not en or hi
 i18n.locale = 'ru'; // If we do not want the framework to use the phone's locale by default

 i18n.translations = {
   ru,
   en,
   vi
 };

 export const setLocale = (locale) => {
    i18n.locale = locale;
    return i18n.translate.bind(i18n);
 };

 export const getCurrentLocale = () => i18n.locale; // It will be used to define intial language state in reducer.

 /* translateHeaderText:
  screenProps => coming from react-navigation (defined in app.container.js)
  langKey => will be passed from the routes file depending on the screen.(We will explain the usage later int the coming topics)
 */
 export const translateHeaderText = (langKey) => ({screenProps}) => {
   const title = i18n.translate(langKey, screenProps.language);
   return {title};
 };

 export default i18n.translate.bind(i18n);