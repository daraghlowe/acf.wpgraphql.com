import { gql } from '@apollo/client'
import React from 'react';

import {
  Card,
  CardHeader,
} from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { snakeToPascalCase } from '@/lib/snakeToPascalCase';

const EXAMPLE_KEY = 'example_key'

const tabData = [
  {
    key: 'php',
    name: 'PHP',
    component: PHPTabContent
  },
  {
    key: 'json',
    name: 'JSON',
    component: JSONTabContent
  },
];

function PHPTabContent({fieldTypeConfigurationBlockFields}) {
  const { acfFieldType } = fieldTypeConfigurationBlockFields;
  const phpGuts = `array(
      'key'                   => 'group_${EXAMPLE_KEY}',
      'title'                 => 'My Field Group with ${acfFieldType}',
      'show_in_graphql'       => 1,
      'graphql_field_name'    => 'myFieldGroupWith${snakeToPascalCase(acfFieldType)}',
      'map_graphql_types_from_location_rules' => 0,
      'graphql_types'         => array( 'Page' ),
      'fields'                => array(
        array(
          'key'                => 'field_${EXAMPLE_KEY}',
          'label'              => 'My Field',
          'name'               => 'my_field',
          'type'               => '${acfFieldType}',
          'show_in_graphql'    => 1,
          'graphql_field_name' => 'myField',
        ),
      ),
      'location'              => array(
        array(
          array(
            'param'    => 'post_type',
            'operator' => '==',
            'value'    => 'page',
          ),
        ),
      )
    )`
  
  let phpString = `<?php
add_action( 'acf/include_fields', function() {
  // Check if the ACF function exists
  if ( ! function_exists( 'acf_add_local_field_group' ) ) {
      return;
  }

  // Add local field group
  acf_add_local_field_group(
    ${phpGuts}
  );
});
`;

  return(
    <pre className='mb-4 mt-6 max-h-[650px] overflow-x-auto rounded-lg border py-4'>
      {phpString}
    </pre>
  )
}

function JSONTabContent({fieldTypeConfigurationBlockFields}) {
  const { acfFieldType } = fieldTypeConfigurationBlockFields;
  
  const jsonOutput = {
    key: `group_${EXAMPLE_KEY}`,
    title: `My Field Group with ${acfFieldType}`,
    fields: [
      {
        key: `field_${EXAMPLE_KEY}`,
        label: 'My Field',
        name: 'my_field',
        type: acfFieldType,
      }
    ]
  };

  const jsonString = JSON.stringify(jsonOutput, null, 2);

  return(
    <pre className='mb-4 mt-6 max-h-[650px] overflow-x-auto rounded-lg border py-4'>
      {jsonString}
    </pre>
  )
}

export function AcfFieldTypeConfigurationBlock({ fieldTypeConfigurationBlockFields }) {
  return (
    <Card>
      <CardHeader className="grid grid-cols-[1fr_110px] items-start gap-4 space-y-0">
        <Tabs defaultValue={tabData[0].key}>
          <TabsList aria-label="Dynamic Tabs">
            {tabData.map(tab => (
              <TabsTrigger key={tab.key} value={tab.key}>
                {tab.name}
              </TabsTrigger>
            ))}
          </TabsList>
          {tabData.map(tab => (
            <TabsContent key={tab.key} value={tab.key}>
              {tab.component({ fieldTypeConfigurationBlockFields })}
            </TabsContent>
          ))}
        </Tabs>
      </CardHeader>
    </Card>
  );
};

AcfFieldTypeConfigurationBlock.displayName = `AcfFieldTypeConfigurationBlock`
AcfFieldTypeConfigurationBlock.config = {
  name: `AcfFieldTypeConfigurationBlock`,
}
AcfFieldTypeConfigurationBlock.fragments = {
  key: `AcfFieldTypeConfigurationBlockFragment`,
  entry: gql`
    fragment AcfFieldTypeConfigurationBlockFragment on AcfFieldTypeConfigurationBlock {
      fieldTypeConfigurationBlockFields {
        acfFieldType
      }
    }
  `,
}
