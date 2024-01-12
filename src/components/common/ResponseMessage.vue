<template>
    <div>
        <div v-if="status200" class="box-area success">
            <div class="marker green"></div>
            <div class="message-area">
                <font-awesome-icon icon="fa-solid fa-check" class="icon" />
                {{ responseMessage }}
            </div>
        </div>
        <div v-else class="box-area error">
            <div class="marker red"></div>
            <div class="message-area">
                <font-awesome-icon icon="fa-solid fa-xmark" class="icon" />
                {{ responseMessage }}
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "ResponseMessage",

    props: {
        status200: Boolean,
        responseMessage: String,
    },

    data() {
        return {
            showResponseMessage: false,
        };
    },

    methods: {
        closeMessage() {
            this.$emit('closeMessage')
        }
    },

    mounted() {
        setTimeout(this.closeMessage, 3000);
    },
};
</script>

<style scoped>
.box-area {
    position: absolute;
    top: 15px;
    right: 75px;
    height: 90px;
    width: 500px;
    z-index: 12;
    border-radius: 8px;

    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bold;
}

.success {
    background-color: rgb(154, 220, 154);
}

.error {
    background-color: rgb(243, 186, 186);
}

.marker {
    width: 3%;
    height: 100%;
    border-radius: 8px 0 0 8px;
}

.red {
    background-color: red;
}

.green {
    background-color: rgb(19, 163, 0);
}

.message-area {
    width: 97%;
}

.icon {
    margin-right: 15px;
    font-size: 20px;
}
</style>