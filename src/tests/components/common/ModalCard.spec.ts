import { mount } from '@vue/test-utils';
import { describe, it, expect } from "vitest";
import ModalCard from '@/components/base/ModalCard.vue';
import DefaultButton from "@/components/base/DefaultButton.vue";

describe('ModalCard.vue', () => {
  it('renders slot content correctly', () => {
    const wrapper = mount(ModalCard, {
      slots: {
        default: '<p>Test content</p>',
      },
    });
    expect(wrapper.html()).toContain('<p>Test content</p>');
  });

  it('applies "top-up" class when isForm is true', () => {
    const wrapper = mount(ModalCard, {
      props: { isForm: true },
    });
    expect(wrapper.classes()).toContain('top-up');
  });

  it('applies "top-down" class when isForm is false', () => {
    const wrapper = mount(ModalCard, {
      props: { isForm: false },
    });
    expect(wrapper.classes()).toContain('top-down');
  });

  it('renders the correct default button message', () => {
    const wrapper = mount(ModalCard, {
      props: { isForm: false },
      global: {
        components: { DefaultButton },
      },
    });
    expect(wrapper.text()).toContain('Confirmar');
  });

  it('renders the custom button message if provided', () => {
    const wrapper = mount(ModalCard, {
      props: { buttonMessage: 'Submit', isForm: false },
      global: {
        components: { DefaultButton },
      },
    });
    expect(wrapper.text()).toContain('Submit');
  });

  // it('emits "execute-action" when the confirm button is clicked', async () => {
  //   const wrapper = mount(ModalCard, {
  //     props: { isForm: false },
  //     global: {
  //       components: { DefaultButton },
  //     },
  //   });

  //   const confirmButton = wrapper.find('button[style="background-color: green"]');
  //   await confirmButton.trigger('click');
  //   expect(wrapper.emitted('execute-action')).toBeTruthy();
  // });

  // it('emits "close-modal" when the cancel button is clicked', async () => {
  //   const wrapper = mount(ModalCard, {
  //     props: { isForm: false },
  //     global: {
  //       components: { DefaultButton },
  //     },
  //   });

  //   const cancelButton = wrapper.find('button[style="background-color: red"]');
  //   await cancelButton.trigger('click');
  //   expect(wrapper.emitted('close-modal')).toBeTruthy();
  // });

  it('does not render buttons when isForm is true', () => {
    const wrapper = mount(ModalCard, {
      props: { isForm: true },
    });

    expect(wrapper.find('.form-buttons-area').exists()).toBe(false);
  });

  it('renders buttons when isForm is false', () => {
    const wrapper = mount(ModalCard, {
      props: { isForm: false },
    });

    expect(wrapper.find('.form-buttons-area').exists()).toBe(true);
  });
});
