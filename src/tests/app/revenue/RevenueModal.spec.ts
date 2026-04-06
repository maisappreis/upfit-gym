import { mount } from "@vue/test-utils";
import { describe, it, expect, vi } from "vitest";
import { ref } from "vue";
import RevenueModal from "@/features/revenue/components/RevenueModal.vue";
import type { CrudModal } from "@/shared/composables/useCrudModal";
import type { Revenue } from "@/features/revenue/types/revenue";

vi.mock("@/stores/loading", () => ({
  useLoadingStore: () => ({
    isLoading: false,
  }),
}));

vi.mock("@/stores/api", () => ({
  useApiStore: () => ({
    customers: [
      { id: 1, name: "Joao", status: "Ativo" },
      { id: 2, name: "Maria", status: "Inativo" },
    ],
  }),
}));

vi.mock("@/shared/components/ModalCard.vue", () => ({
  default: {
    name: "ModalCard",
    props: ["modelValue"],
    template:
      "<div><slot name='header'></slot><slot></slot><slot name='footer'></slot></div>",
  },
}));

vi.mock("@/shared/components/BaseButton.vue", () => ({
  default: {
    name: "BaseButton",
    template: "<button @click='$emit(\"click\")'><slot /></button>",
  },
}));

vi.mock("@/features/revenue/components/RevenueForm.vue", () => ({
  default: {
    name: "RevenueForm",
    template: "<div class='revenue-form'></div>",
    data() {
      return { isValid: true };
    },
  },
}));

const createModalCrud = (mode: "create" | "update" | "delete") =>
  ({
    isOpen: ref(true),
    isForm: ref(mode !== "delete"),
    isDelete: ref(mode === "delete"),
    deleteIsBlocked: ref(false),
    mode: ref(mode),
    entity: ref(null),
    openCreate: vi.fn(),
    openUpdate: vi.fn(),
    openDelete: vi.fn(),
    close: vi.fn(),
  }) as unknown as CrudModal<Revenue>;

describe("RevenueModal.vue", () => {
  const factory = (mode: "create" | "update" | "delete", showConfirmation = false) =>
    mount(RevenueModal, {
      props: {
        modalCrud: createModalCrud(mode),
        showConfirmation,
        revenueForm: {
          customer: 1,
          month: "Janeiro",
          year: 2024,
          value: 200,
          payment_day: 10,
          notes: 'Teste',
          paid: 'Pago'
        },
        revenue: {
          id: 1,
          customer: 1,
          month: 'Janeiro',
          year: 2024,
          value: 200,
          payment_day: 10,
          notes: 'Teste',
          paid: 'Pago',
          name: 'test',
          plan: 'Mensal',
          start: '2024-01-01',
          status: 'Ativo'
        },
        customer: {
          id: 1,
          name: "Joao",
          value: 150,
          frequency: '1x',
          start: '2024-01-01',
          plan: 'Mensal',
          status: 'Ativo',
          notes: 'Teste'
        },
      },
    });

  it("renders form when mode is create", () => {
    const wrapper = factory("create");

    expect(wrapper.find(".revenue-form").exists()).toBe(true);
    expect(wrapper.text()).toContain("Adicionar Receita");
  });

  it("renders form when mode is update", () => {
    const wrapper = factory("update");

    expect(wrapper.find(".revenue-form").exists()).toBe(true);
    expect(wrapper.text()).toContain("Atualizar Receita");
  });

  it("renders delete confirmation message", () => {
    const wrapper = factory("delete");

    expect(wrapper.text()).toContain("Tem certeza que deseja excluir o recebimento da mensalidade");
  });

  it("renders change value confirmation message", () => {
    const wrapper = factory("update", true);

    expect(wrapper.text()).toContain("Você gostaria de atualizar todos os futuros pagamentos");
  });

  it("emits delete-revenue when confirm delete is clicked", async () => {
    const wrapper = factory("delete");

    await wrapper.find("button").trigger("click");

    expect(wrapper.emitted("delete-revenue")).toBeTruthy();
  });

  it("emits change-value when confirmation button is clicked", async () => {
    const wrapper = factory("update", true);

    await wrapper.find("button").trigger("click");

    expect(wrapper.emitted("change-value")).toBeTruthy();
  });

  it("emits create-revenue when form is submitted", async () => {
    const wrapper = factory("create");

    (wrapper.vm as any).formRef = { isValid: true }

    await (wrapper.vm as any).submitForm()

    expect(wrapper.emitted("create-revenue")).toBeTruthy();
  });

  it("emits update-revenue when mode is update", async () => {
    const wrapper = factory("update");

    (wrapper.vm as any).formRef = { isValid: true };

    await (wrapper.vm as any).submitForm();

    expect(wrapper.emitted("update-revenue")).toBeTruthy();
  });

  it("emits close-modal when cancel button is clicked", async () => {
    const wrapper = factory("create");

    const buttons = wrapper.findAll("button");
    await buttons[buttons.length - 1].trigger("click");

    expect(wrapper.emitted("close-modal")).toBeTruthy();
  });
});