<template>
  <Form :form="form">
    <SchemaField :schema="schema" />
  </Form>
</template>

<script setup lang="ts">
import { createForm, isVoidField, DataField } from '@formily/core'
import { createSchemaField } from '@formily/vue'
import {
  Form,
  ArrayTable,
  Input,
  Select,
  FormItem,
  FormCollapse,
} from '@formily/element-plus'
import { uid } from '@formily/shared'

const schema = {
  type: 'object',
  properties: {
    collapse: {
      type: 'void',
      'x-component': 'FormCollapse',
      'x-component-props': {
        defaultActiveKey: ['deps', 'state'],
        style: { marginBottom: '10px' },
      },
      properties: {
        deps: {
          type: 'void',
          'x-component': 'FormCollapse.Item',
          'x-component-props': {
            key: 'deps',
            title: 'SettingComponents.ReactionsSetter.relationsFields',
          },
          properties: {
            dependencies: {
              default: [{}],
              type: 'array',
              'x-component': 'ArrayTable',
              'x-component-props': { border: true, fit: true },
              items: {
                type: 'object',
                properties: {
                  column1: {
                    type: 'void',
                    'x-component': 'ArrayTable.Column',
                    'x-component-props': {
                      title: 'SettingComponents.ReactionsSetter.sourceField',
                      minWidth: 240,
                    },
                    properties: {
                      source: {
                        'x-decorator': 'FormItem',
                        'x-component': 'PathSelector',
                        'x-component-props': {
                          placeholder:
                            'SettingComponents.ReactionsSetter.pleaseSelect',
                        },
                      },
                    },
                  },
                  column2: {
                    type: 'void',
                    'x-component': 'ArrayTable.Column',
                    'x-component-props': {
                      title: 'SettingComponents.ReactionsSetter.sourceProperty',
                      minWidth: 200,
                    },
                    properties: {
                      property: {
                        default: 'value',
                        'x-decorator': 'FormItem',
                        'x-component': 'Select',
                        'x-component-props': {
                          showSearch: true,
                        },
                        enum: [],
                      },
                    },
                  },
                  column3: {
                    type: 'void',
                    'x-component': 'ArrayTable.Column',
                    'x-component-props': {
                      title: 'SettingComponents.ReactionsSetter.variableName',
                      minWidth: 200,
                    },
                    properties: {
                      name: {
                        'x-decorator': 'FormItem',
                        'x-validator': {
                          pattern: /^[$_a-zA-Z]+[$_a-zA-Z0-9]*$/,
                          message:
                            'SettingComponents.ReactionsSetter.variableNameValidateMessage',
                        },
                        'x-component': 'Input',
                        'x-component-props': {
                          placeholder:
                            'SettingComponents.ReactionsSetter.pleaseInput',
                        },
                        'x-content': { prepend: '$deps.' },
                        'x-reactions': (field: DataField) => {
                          if (isVoidField(field)) return
                          field.query('.source').take((source) => {
                            if (isVoidField(source)) return
                            if (
                              source.value &&
                              !field.value &&
                              !field.modified
                            ) {
                              field.value =
                                source.inputValues[1]?.props?.name ||
                                `v_${uid()}`
                            }
                          })
                        },
                      },
                    },
                  },
                  column4: {
                    type: 'void',
                    'x-component': 'ArrayTable.Column',
                    'x-component-props': {
                      title: 'SettingComponents.ReactionsSetter.variableType',
                      ellipsis: {
                        showTitle: false,
                      },
                      minWidth: 200,
                      align: 'center',
                    },
                    properties: {
                      type: {
                        default: 'any',
                        'x-component': 'TypeView',
                        'x-reactions': (field: DataField) => {
                          if (isVoidField(field)) return
                          const property = field
                            .query('.property')
                            .get('inputValues')
                          if (!property) return
                          property[0] = property[0] || 'value'
                          field.query('.source').take((source) => {
                            if (isVoidField(source)) return
                            if (source.value) {
                              if (
                                property[0] === 'value' ||
                                property[0] === 'initialValue' ||
                                property[0] === 'inputValue'
                              ) {
                                field.value =
                                  source.inputValues[1]?.props?.type || 'any'
                              } else if (property[0] === 'inputValues') {
                                field.value = `any[]`
                              } else if (property[0]) {
                                field.value = `any`
                              } else {
                                field.value = 'any'
                              }
                            }
                          })
                        },
                      },
                    },
                  },
                  column5: {
                    type: 'void',
                    'x-component': 'ArrayTable.Column',
                    'x-component-props': {
                      title: 'SettingComponents.ReactionsSetter.operations',
                      align: 'center',
                      minWidth: 80,
                    },
                    properties: {
                      remove: {
                        type: 'void',
                        'x-component': 'ArrayTable.Remove',
                      },
                    },
                  },
                },
              },
              properties: {
                addition: {
                  type: 'void',
                  title: 'SettingComponents.ReactionsSetter.addRelationField',
                  'x-component': 'ArrayTable.Addition',
                  'x-component-props': {
                    style: { marginTop: '8px' },
                  },
                },
              },
            },
          },
        },
        state: {
          type: 'void',
          'x-component': 'FormCollapse.Item',
          'x-component-props': {
            class: 'reaction-state',
            title: 'SettingComponents.ReactionsSetter.propertyReactions',
            key: 'state',
          },
          properties: {
            'fulfill.state': {
              type: 'object',
              'x-component': 'FieldPropertySetter',
            },
          },
        },
        run: {
          type: 'void',
          'x-component': 'FormCollapse.Item',
          'x-component-props': {
            key: 'run',
            title: 'SettingComponents.ReactionsSetter.actionReactions',
            class: 'reaction-runner',
          },
          properties: {
            'fulfill.run': {
              type: 'string',
              'x-component': 'MonacoInput',
              'x-component-props': {
                width: '100%',
                height: 400,
                language: 'typescript',
                helpCode: 'FulfillRunHelper',
                options: {
                  minimap: {
                    enabled: false,
                  },
                },
              },
              'x-reactions': (field: any) => {},
            },
          },
        },
      },
    },
  },
}

const form = createForm()
const { SchemaField } = createSchemaField({
  components: {
    FormItem,
    Input,
    ArrayTable,
    Select,
    FormCollapse,
  },
})

const onSubmit = (value: any) => {
  console.log(value)
}
</script>
