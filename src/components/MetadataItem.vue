<template>
      <div v-if="Array.isArray(parsedValue)">
        <strong>{{ label }}:</strong>
        <ul>
          <li v-for="item in parsedValue" :key="item.key">
            <MetadataItem :label="item.key" :value="item.value" />
          </li>
        </ul>
      </div>
      <div v-else-if="typeof parsedValue === 'object'">
        <strong>{{ label }}:</strong>
        <ul>
          <li v-for="(value, key) in parsedValue" :key="key">
            <MetadataItem :label="key" :value="value" />
          </li>
        </ul>
      </div>
      <div v-else>
        <strong>{{ label }}:</strong> <span>{{ parsedValue }}</span>
      </div>
    </template>
    
    <script>
    import { defineComponent, computed } from 'vue';
    import { parseMetadata } from '@/utils/metadataParser';
    
    export default defineComponent({
      name: 'MetadataItem',
      props: {
        label: String,
        value: [String, Object, Array, Number, BigInt]
      },
      setup(props) {
        const parsedValue = computed(() => parseMetadata(props.value));
        return { parsedValue };
      }
    });
    </script>
    
    <style scoped>
    ul {
      list-style-type: none;
      padding-left: 1em;
      margin: 0;
    }
    
    li {
      margin-bottom: 0.5em;
    }
    
    div {
      margin-bottom: 1em;
    }
    
    strong {
      display: inline-block;
      font-weight: bold;
      margin-right: 0.5em;
    }
    
    span {
      font-size: 0.9em;
      color: #555;
    }
    </style>
    