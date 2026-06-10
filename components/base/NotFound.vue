<template>
    <div class="w-screen h-screen text-center flex items-center justify-center bg-cover bg-[url('/images/pig.png')]">
      <div class="text-primary">
        <h1 class="text-8xl sm:text-10xl font-medium mb-8">ไม่พบหน้าเว็บนี้</h1>
        <p class="text-xl px-8 sm:px-0 sm:text-4xl font-light mb-16 leading-tight">
          กรุณารอการอัพเดตในเวอร์ชันถัดไป เร็วๆนี้
        </p>
        <div class="w-full flex items-center justify-center">
          <button @click="() => $router.back()"
            class="bg-primary text-white rounded-md gradient-border text-md sm:text-xl py-2 px-4 sm:py-3 sm:px-6 cursor-pointer">
            ย้อนกลับ
          </button>
        </div>
        <div class="mt-4 w-full flex items-center justify-center">
          <button @click="onLogout"
            class="text-primary rounded-md gradient-border text-md sm:text-xl py-2 px-4 sm:py-3 sm:px-6 cursor-pointer">
            เข้าสู่ระบบอีกครั้ง
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import {
    meProfile,
    useCookie,
  } from "#imports";
  
  export default {
    async setup() {
      const userAuthCookie = useCookie("token");
  
      return { userAuthCookie };
    },
    data() {
      return {};
    },
    mounted() {
    },
    methods: {
      onLogout() {
        this.userAuthCookie = null;
        localStorage.removeItem(meProfile);
        this.$router.push("/login");
      },
    },
  };
  </script>