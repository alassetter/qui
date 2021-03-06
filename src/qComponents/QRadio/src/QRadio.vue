<template>
  <label
    class="q-radio"
    :class="wrapClass"
    role="radio"
    :aria-checked="isChecked"
    :aria-disabled="isDisabled"
    :tabindex="tabIndex"
    @keyup.space="handleSpaceKeyUp"
  >
    <span class="q-radio__input">
      <span class="q-radio__inner" />
      <input
        class="q-radio__original"
        type="radio"
        aria-hidden="true"
        tabindex="-1"
        :name="name"
        :value="value"
        :checked="isChecked"
        :disabled="isDisabled"
        @change="handleChange"
      />
    </span>
    <span
      class="q-radio__label"
      @keydown.stop
    >
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>

<script>
import Emitter from '../../mixins/emitter';

export default {
  name: 'QRadio',
  componentName: 'QRadio',

  mixins: [Emitter],

  inject: {
    qForm: {
      default: null
    },
    qFormItem: {
      default: null
    },
    qRadioGroup: {
      default: null
    }
  },

  model: {
    prop: 'checked',
    event: 'change'
  },

  props: {
    /**
     * the value of Radio label
     */
    label: { type: String, default: '' },
    /**
     * binding value
     */
    value: { type: [String, Number, Boolean], default: '' },
    checked: { type: [String, Number, Boolean], default: false },
    /**
     * whether Radio is disabled
     */
    disabled: { type: Boolean, default: false },
    /**
     * as native name
     */
    name: { type: String, default: null }
  },

  computed: {
    isGroup() {
      return Boolean(this.qRadioGroup);
    },

    isChecked() {
      if (this.isGroup) return this.qRadioGroup?.value === this.value;

      if (typeof this.checked === typeof this.value) {
        return this.checked === this.value;
      }

      return Boolean(this.checked);
    },

    isDisabled() {
      return (
        this.disabled ||
        (this.qForm?.disabled ?? false) ||
        (this.qRadioGroup?.disabled ?? false)
      );
    },

    wrapClass() {
      return {
        'q-radio_disabled': this.isDisabled,
        'q-radio_checked': this.isChecked
      };
    },

    tabIndex() {
      return this.isDisabled || (this.isGroup && !this.isChecked) ? -1 : 0;
    }
  },

  methods: {
    handleSpaceKeyUp() {
      if (this.isGroup) return;

      this.$emit('change', this.value);
    },

    handleChange() {
      /**
       * triggers when the value changes
       */
      this.$emit('change', this.value);

      if (this.isGroup) {
        this.dispatch('QRadioGroup', 'change', this.value);
      }
    }
  }
};
</script>
