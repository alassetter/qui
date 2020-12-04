/* eslint-disable global-require */
/* eslint-disable no-param-reassign */
import { merge } from 'lodash-es';
import vClickOutside from 'v-click-outside';
import VueI18n from 'vue-i18n';
import { version } from '../../package.json';
import messages from './constants/localizationConfig';

const kebabCase = require('lodash/kebabCase');

const allComponents = [
  'QButton',
  'QBreadcrumbs',
  'QCascader',
  'QDatePicker',
  'QTimePicker',
  'QCheckbox',
  'QCheckboxGroup',
  'QRadio',
  'QRadioGroup',
  'QRow',
  'QCol',
  'QCollapse',
  'QCollapseItem',
  'QColorPicker',
  'QContextMenu',
  'QForm',
  'QFormItem',
  'QInput',
  'QInputNumber',
  'QMessageBox',
  'QPagination',
  'QPopover',
  'QScrollbar',
  'QSelect',
  'QOption',
  'QTextarea',
  'QTabs',
  'QTabPane',
  'QTag',
  'QDrawer',
  'QTable',
  'QForm',
  'QFormItem',
  'QUpload',
  // modals
  'QNotification',
  'QDialog',
  'QMessageBox'
];

let zIndexCounter = 2000;
const install = (
  Vue,
  {
    components = allComponents,
    localization: { locale = 'ru', customI18nMessages = {} } = {},
    styles: {
      // theme = 'neumorphism', - it will be used in future
      importStyles: {
        fonts = true,
        icons = true,
        main = true,
        qComponents = true
      } = {}
    } = {}
  } = {}
) => {
  const validComponents = components.filter(component => {
    if (!allComponents.includes(component)) {
      console.error(`Qui does not contain component ${component}`);
      return false;
    }

    return component;
  });

  // import styles
  if (fonts) {
    require('../fonts/index.scss');
  }

  if (icons) {
    require('../icons/index.scss');
  }

  if (main) {
    require('../main.scss');
  }

  if (qComponents) {
    validComponents.forEach(component => {
      try {
        // eslint-disable-next-line import/no-dynamic-require
        require(`../qComponents/${component}/src/${kebabCase(component)}.scss`);
      } catch (err) {
        console.warn(err);
      }
    });
  }

  // define plugins
  Object.defineProperties(Vue.prototype, {
    $Q: {
      value: {
        zIndex: {
          get() {
            zIndexCounter += 1;

            return zIndexCounter;
          }
        },
        locale
      }
    }
  });

  Vue.use(VueI18n);
  Vue.use(vClickOutside);

  const i18n = new VueI18n({
    locale,
    messages: merge(messages, customI18nMessages)
  });

  // eslint-disable-next-line no-underscore-dangle
  Vue.prototype._i18n = i18n;

  // import components
  validComponents.forEach(component => {
    Vue.component(component, () => import(`./${component}`));
  });
};

/* istanbul ignore if */
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export default {
  version,
  install
};

export { allComponents };
