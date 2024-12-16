import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import MonthFilter from "@/components/common/MonthFilter.vue";
import { months } from "@/utils/variables";

describe("MonthFilter.vue", () => {
  it("renders the component correctly with props", () => {
    const statusList = ["Pago", "À pagar", "Link enviado", "Todos"];
    const wrapper = mount(MonthFilter, {
      props: { statusList },
    });

    const monthOptions = wrapper.findAll("select#month option");
    expect(monthOptions.length).toBe(13);

    const yearOptions = wrapper.findAll("select#year option");
    expect(yearOptions.length).toBe(17);

    const statusOptions = wrapper.findAll("select#status option");
    expect(statusOptions.length).toBe(statusList.length + 1);
  });

  it("updates month value and emits event on change", async () => {
    const wrapper = mount(MonthFilter, {
      props: { statusList: ["Pago", "À pagar", "Link enviado", "Todos"] },
    });
  
    const monthSelect = wrapper.find("select#month").element as HTMLSelectElement;
  
    monthSelect.value = "Dezembro";
    await wrapper.find("select#month").trigger("change");
  
    expect(monthSelect.value).toBe("Dezembro");
    expect(wrapper.emitted()["get-month"][0]).toEqual(["Dezembro"]);
  });

  it("updates year value and emits event on change", async () => {
    const wrapper = mount(MonthFilter, {
      props: { statusList: ["Pago", "À pagar", "Link enviado", "Todos"] },
    });
  
    const yearSelect = wrapper.find("select#year").element as HTMLSelectElement;
  
    yearSelect.value = "2024";
    await wrapper.find("select#year").trigger("change");
  
    expect(yearSelect.value).toBe("2024");
    expect(wrapper.emitted()["get-year"][0]).toEqual([2024]);
  });

  it("updates status value and emits event on change", async () => {
    const wrapper = mount(MonthFilter, {
      props: { statusList: ["Pago", "À pagar", "Link enviado", "Todos"] },
    });
  
    const statusSelect = wrapper.find("select#status").element as HTMLSelectElement;
  
    statusSelect.value = "Todos";
    await wrapper.find("select#status").trigger("change");
  
    expect(statusSelect.value).toBe("Todos");
    expect(wrapper.emitted()["get-status"][0]).toEqual(["Todos"]);
  });

  it("initializes with current month and year", () => {
    const statusList = ["Pago", "À pagar", "Link enviado", "Todos"];
    const wrapper = mount(MonthFilter, {
      props: { statusList },
    });

    const currentDate = new Date();
    const currentMonth = months[currentDate.getMonth()];
    const currentYear = currentDate.getFullYear();

    const monthSelect = wrapper.find("select#month").element as HTMLSelectElement;
    const yearSelect = wrapper.find("select#year").element as HTMLSelectElement;
  
    monthSelect.value = currentMonth;
    yearSelect.value = currentYear.toString();

    wrapper.find("select#month");
    expect(monthSelect.value).toBe(currentMonth);

    wrapper.find("select#year");
    expect(Number(yearSelect.value)).toBe(currentYear);
  
    expect(wrapper.emitted()["get-month"][0]).toEqual([currentMonth]);
    expect(wrapper.emitted()["get-year"][0]).toEqual([currentYear]);
    expect(wrapper.emitted()["get-status"][0]).toEqual(["Todos"]);
  });
});
