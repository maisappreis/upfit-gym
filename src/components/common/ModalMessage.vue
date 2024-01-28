<template>
    <div>
        <h3 class="message-area">
            <span v-if="blockDelete">
                Não é possível excluir o cliente <strong class="highlight">{{ data.name }}</strong>,
                pois isso excluiria todo o seu histórico de receitas. Ao invés de excluí-lo, mude seu
                status para <strong class="highlight">Inativo</strong>.
            </span>
            <span v-else-if="!blockDelete && data.view === 'customer'">
                Tem certeza que deseja excluir o cliente <strong class="highlight">{{ data.name }}</strong>?
            </span>
            <span v-else-if="data.view === 'revenue'">
                Tem certeza que deseja excluir o recebimento da mensalidade do 
                cliente <strong class="highlight">{{ data.name }}</strong> referente ao mês de
                <strong class="highlight">{{ data.date }}</strong>?
            </span>
            <span v-else-if="data.view === 'expense'">
                Tem certeza que deseja excluir o pagamento da despesa
                de <strong class="highlight">{{ data.name }}</strong> referente ao mês de
                <strong class="highlight">{{ data.date }}</strong>?
            </span>
        </h3>
        <div class="form-buttons-area">
            <DefaultButton
                v-if="!blockDelete"
                style="background-color: green"
                @executeAction="$emit('deleteItem')"
            >
                Confirmar
            </DefaultButton>
            <DefaultButton
                v-else
                style="background-color: green"
                @executeAction="$emit('inactiveCustomer')"
            >
                Inativar cliente
            </DefaultButton>
            <DefaultButton
                style="background-color: red"
                @executeAction="$emit('closeModal')"
            >
                Cancelar
            </DefaultButton>
        </div>
    </div>
</template>

<script>
import DefaultButton from "./DefaultButton.vue";

export default {
    name: "ModalMessage",

    components: {
        DefaultButton,
    },

    props: {
        data: Object,
        blockDelete: {
            required: false,
            default: false
        },
    },
};
</script>

<style scoped>
.message-area {
    padding: 20px 40px 0 20px;
    line-height: 1.5;
}

.highlight {
    color: red;
    text-decoration-line: underline;
}
</style>