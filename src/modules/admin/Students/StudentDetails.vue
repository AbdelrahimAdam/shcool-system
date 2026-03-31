<template>
  <div class="p-6">
    <div class="max-w-3xl mx-auto bg-white shadow rounded-lg p-6">

      <!-- Header -->
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Student Details</h1>

        <router-link
          to="/admin/students"
          class="text-blue-600 hover:underline"
        >
          Back
        </router-link>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-10">
        Loading student...
      </div>

      <!-- Error -->
      <div v-if="error" class="text-red-500 text-center">
        {{ error }}
      </div>

      <!-- Content -->
      <div v-if="student" class="space-y-4">

        <div>
          <span class="font-semibold">Name:</span>
          {{ student.name }}
        </div>

        <div>
          <span class="font-semibold">Email:</span>
          {{ student.email }}
        </div>

        <div>
          <span class="font-semibold">Phone:</span>
          {{ student.phone || "N/A" }}
        </div>

        <div>
          <span class="font-semibold">Class:</span>
          {{ student.class || "N/A" }}
        </div>

        <div>
          <span class="font-semibold">Status:</span>
          <span :class="statusClass">
            {{ student.status || "Active" }}
          </span>
        </div>

      </div>

    </div>
  </div>
</template>

<script>
import { supabase } from "@/services/supabase";

export default {
  name: "StudentDetails",

  data() {
    return {
      student: null,
      loading: true,
      error: ""
    };
  },

  computed: {
    statusClass() {
      return this.student?.status === "inactive"
        ? "text-red-500"
        : "text-green-600";
    }
  },

  async mounted() {
    await this.fetchStudent();
  },

  methods: {
    async fetchStudent() {
      try {
        const id = this.$route.params.id;

        const { data, error } = await supabase
          .from("students")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;

        this.student = data;

      } catch (err) {
        this.error = err.message || "Failed to load student";
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
</style>