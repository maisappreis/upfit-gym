import { mount } from "@vue/test-utils";
import { describe, it, expect, vi } from "vitest";
import { ref } from "vue";
import ExpensesModal from "@/features/expense/components/ExpensesModal.vue";
import type { Expense } from "@/features/expense/types/expense";
import type { CrudModal } from "@/shared/composables/useCrudModal";

vi.mock("@/shared/stores/loading", () => ({
  useLoadingStore: () => ({
    isLoading: false,
  }),
}));

vi.mock("@/shared/utils/dataUtils", () => ({
  capitalize: (v: string) => v.charAt(0).toUpperCase() + v.slice(1),
}));

vi.mock("@/shared/utils/dateUtils", () => ({
  getYearAndMonth: () => ({
    year: 2024,
    month: "Janeiro",
  }),
}));

vi.mock("@/shared/components/ModalCard.vue", () => ({
  default: {
    name: "ModalCard",
    props: ["modelValue"],
    template: "<div><slot name='header'></slot><slot></slot><slot name='footer'></slot></div>",
  },
}));

vi.mock("@/shared/components/BaseButton.vue", () => ({
  default: {
    name: "BaseButton",
    template: "<button @click='$emit(\"click\")'><slot /></button>",
  },
}));

vi.mock("@/features/expense/components/ExpensesForm.vue", () => ({
  default: {
    name: "ExpensesForm",
    template: "<div class='expenses-form'></div>",
    data() {
      return { isValid: true };
    },
  },
}));

const createModalCrud = (
  mode: "create" | "update" | "delete"
) =>
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
  }) as unknown as CrudModal<Expense>;

describe("ExpensesModal.vue", () => {
  const factory = (mode: "create" | "update" | "delete") =>
    mount(ExpensesModal, {
      props: {
        modalCrud: createModalCrud(mode),
        expenseForm: {
          name: "internet",
          value: 100,
          date: "2024-01-01",
          month: "Janeiro",
          year: 2024,
          installments: '2',
          notes: 'Teste',
          paid: "Pago",
        },
        expense: {
          id: 1,
          name: "Internet",
          month: "Janeiro",
          year: 2024,
          value: 100,
          date: "2024-01-01",
          installments: '2',
          notes: 'Teste',
          paid: "Pago",
        },
      },
    });

  it("renders form when mode is create", () => {
    const wrapper = factory("create");

    expect(wrapper.find(".expenses-form").exists()).toBe(true);
    expect(wrapper.text()).toContain("Adicionar Despesa");
  });

  it("renders form when mode is update", () => {
    const wrapper = factory("update");

    expect(wrapper.find(".expenses-form").exists()).toBe(true);
    expect(wrapper.text()).toContain("Atualizar Despesa");
  });

  it("renders delete confirmation message", () => {
    const wrapper = factory("delete");

    expect(wrapper.text()).toContain("Tem certeza que deseja excluir o pagamento da despesa");
  });

  it("emits delete-expense when confirm delete is clicked", async () => {
    const wrapper = factory("delete");

    await wrapper.find("button").trigger("click");

    expect(wrapper.emitted("delete-expense")).toBeTruthy();
  });

  it("emits create-expense with formatted payload", async () => {
    const wrapper = factory("create");

    (wrapper.vm as any).formRef = { isValid: true }

    await (wrapper.vm as any).submitForm()

    const payload = wrapper.emitted("create-expense")![0][0] as any;

    expect(payload.name).toBe("Internet");
    expect(payload.year).toBe(2024);
    expect(payload.month).toBe("Janeiro");
  });

  it("emits update-expense when mode is update", async () => {
    const wrapper = factory("update");

    (wrapper.vm as any).formRef = { isValid: true }

    await (wrapper.vm as any).submitForm()

    expect(wrapper.emitted("update-expense")).toBeTruthy();
  });

  it("emits close-modal when cancel button is clicked", async () => {
    const wrapper = factory("create");

    const buttons = wrapper.findAll("button");
    await buttons[buttons.length - 1].trigger("click");

    expect(wrapper.emitted("close-modal")).toBeTruthy();
  });
});