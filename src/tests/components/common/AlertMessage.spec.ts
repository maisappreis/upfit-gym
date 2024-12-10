// import { render, screen } from "@testing-library/vue";
import { render } from "@testing-library/vue";
import { describe, it, expect, vi } from "vitest";
import AlertMessage from "@/components/common/AlertMessage.vue";

const mockFontAwesomeIcon = {
  template: `<span><slot /></span>`
};

describe("AlertMessage", () => {
//   it("renders success alert when responseMessage does not contain 'erro'", () => {
//     render(AlertMessage, {
//       props: {
//         responseMessage: "Operação realizada com sucesso!"
//       },
//       global: {
//         components: {
//           "font-awesome-icon": mockFontAwesomeIcon
//         }
//       }
//     })

//     const successAlert = screen.getByText(/Operação realizada com sucesso!/i)
//     expect(successAlert).toBeInTheDocument()
//     expect(screen.getByRole("alert")).toHaveClass("success")
//   });

  // it("renders error alert when responseMessage contains 'erro'", () => {
  //   render(AlertMessage, {
  //     props: {
  //       responseMessage: "Erro ao realizar operação!"
  //     }
  //   });

  //   const errorAlert = screen.getByText(/Erro ao realizar operação!/i);
  //   expect(errorAlert).toBeInTheDocument();
  //   expect(screen.getByRole("alert")).toHaveClass("error");
  // });

  it("emits close-message event after 1 second", async () => {
    vi.useFakeTimers();
    
    const { emitted } = render(AlertMessage, {
      props: {
        responseMessage: "Operação realizada com sucesso!"
      },
      global: {
        components: {
          "font-awesome-icon": mockFontAwesomeIcon
        }
      }
    });

    vi.advanceTimersByTime(1000);
    expect(emitted()["close-message"]).toBeTruthy();
  });
});

