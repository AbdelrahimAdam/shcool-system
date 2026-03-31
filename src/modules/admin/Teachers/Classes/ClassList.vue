<template>
  <div class="p-6">
    <div class="max-w-6xl mx-auto">

      <!-- Header -->
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Classes</h1>

        <router-link
          to="/admin/classes/create"
          class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add Class
        </router-link>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-10">
        Loading classes...
      </div>

      <!-- Error -->
      <div v-if="error" class="text-red-500 text-center">
        {{ error }}
      </div>

      <!-- Table -->
      <div v-if="classes.length" class="bg-white shadow rounded-lg overflow-hidden">

        <table class="w-full text-left">
          <thead class="bg-gray-100">
            <tr>
              <th class="p-3">Name</th>
              <th class="p-3">Teacher</th>
              <th class="p-3">Students</th>
              <th class="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="cls in classes"
              :key="cls.id"
              class="border-t hover:bg-gray-50"
            >
              <td class="p-3">{{ cls.name }}</td>
              <td class="p-3">{{ cls.teacher || "N/A" }}</td>
              <td class="p-3">{{ cls.students_count || 0 }}</td>

              <td class="p-3 space-x-2">
                <router-link
                  :to="`/admin/classes/${cls.id}`"
                  class="text-blue-600 hover:underline"
                >
                  View
                </router-link>

                <button
                  @click="deleteClass(cls.id)"
                  class="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>

        </table>
      </div>

      <!-- Empty -->
      <div v-if="!loading && classes.length === 0" class="text-center py-10 text-gray-500">
        No classes found.
      </div>

    </div>
  </div>
</template>

<script>
import { supabase } from "@/services/supabase";

export default {
  name: "ClassList",

  data() {
    return {
      classes: [],
      loading: true,
      error: ""
    };
  },

  async mounted() {
    await this.fetchClasses();
  },

  methods: {
    async fetchClasses() {
      try {
        const { data, error } = await supabase
          .from("classes")
          .select("*");

        if (error) throw error;

        this.classes = data || [];

      } catch (err) {
        this.error = err.message || "Failed to load classes";
      } finally {
        this.loading = false;
      }
    },

    async deleteClass(id) {
      try {
        const { error } = await supabase
          .from("classes")
          .delete()
          .eq("id", id);

        if (error) throw error;

        this.classes = this.classes.filter(c => c.id !== id);

      } catch (err) {
        alert(err.message);
      }
    }
  }
};
</script>

<style scoped>
</style>