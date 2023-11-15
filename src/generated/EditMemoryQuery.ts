/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: EditMemoryQuery
// ====================================================

export interface EditMemoryQuery_memory {
  __typename: "Memory";
  id: string;
  userId: string;
  message: string;
  image: string;
  publicId: string;
  hearts: number;
  latitude: number;
  longitude: number;
}

export interface EditMemoryQuery {
  memory: EditMemoryQuery_memory | null;
}

export interface EditMemoryQueryVariables {
  id: string;
}
