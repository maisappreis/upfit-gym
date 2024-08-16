import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePageStore = defineStore('page', () => {
    const currentPage = ref('metrics')

    const openPage = (page: string) => {
        currentPage.value = page
    }

    return {
        currentPage,
        openPage,
    }
})