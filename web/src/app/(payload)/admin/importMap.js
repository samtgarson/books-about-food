import {
  AlignFeatureClient as AlignFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
  BlockquoteFeatureClient as BlockquoteFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
  BoldFeatureClient as BoldFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
  ChecklistFeatureClient as ChecklistFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
  HeadingFeatureClient as HeadingFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
  HorizontalRuleFeatureClient as HorizontalRuleFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
  IndentFeatureClient as IndentFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
  InlineCodeFeatureClient as InlineCodeFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
  InlineToolbarFeatureClient as InlineToolbarFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
  ItalicFeatureClient as ItalicFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
  LinkFeatureClient as LinkFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
  OrderedListFeatureClient as OrderedListFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
  ParagraphFeatureClient as ParagraphFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
  RelationshipFeatureClient as RelationshipFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
  StrikethroughFeatureClient as StrikethroughFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
  SubscriptFeatureClient as SubscriptFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
  SuperscriptFeatureClient as SuperscriptFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
  UnderlineFeatureClient as UnderlineFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
  UnorderedListFeatureClient as UnorderedListFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
  UploadFeatureClient as UploadFeatureClient_e70f5e05f09f93e00b997edb1ef0c864
} from '@payloadcms/richtext-lexical/client'
import {
  LexicalDiffComponent as LexicalDiffComponent_44fe37237e0ebf4470c9990d8cb7b07e,
  RscEntryLexicalCell as RscEntryLexicalCell_44fe37237e0ebf4470c9990d8cb7b07e,
  RscEntryLexicalField as RscEntryLexicalField_44fe37237e0ebf4470c9990d8cb7b07e
} from '@payloadcms/richtext-lexical/rsc'
import { S3ClientUploadHandler as S3ClientUploadHandler_f97aa6c64367fa259c5bc0567239ef24 } from '@payloadcms/storage-s3/client'
import { CollectionCards as CollectionCards_ab83ff7e88da8d3530831f296ec4756a } from '@payloadcms/ui/rsc'
import { default as default_27ebd803f1d6864aa932968f3f635a5d } from 'src/payload/components/array-row-label.tsx'
import { default as default_623cfffd3de46a45c0dea5cd6367a895 } from 'src/payload/components/virtual-array-cell.tsx'

export const importMap = {
  'src/payload/components/virtual-array-cell.tsx#default':
    default_623cfffd3de46a45c0dea5cd6367a895,
  'src/payload/components/array-row-label.tsx#default':
    default_27ebd803f1d6864aa932968f3f635a5d,
  '@payloadcms/richtext-lexical/rsc#RscEntryLexicalCell':
    RscEntryLexicalCell_44fe37237e0ebf4470c9990d8cb7b07e,
  '@payloadcms/richtext-lexical/rsc#RscEntryLexicalField':
    RscEntryLexicalField_44fe37237e0ebf4470c9990d8cb7b07e,
  '@payloadcms/richtext-lexical/rsc#LexicalDiffComponent':
    LexicalDiffComponent_44fe37237e0ebf4470c9990d8cb7b07e,
  '@payloadcms/richtext-lexical/client#InlineToolbarFeatureClient':
    InlineToolbarFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
  '@payloadcms/richtext-lexical/client#HorizontalRuleFeatureClient':
    HorizontalRuleFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
  '@payloadcms/richtext-lexical/client#UploadFeatureClient':
    UploadFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
  '@payloadcms/richtext-lexical/client#BlockquoteFeatureClient':
    BlockquoteFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
  '@payloadcms/richtext-lexical/client#RelationshipFeatureClient':
    RelationshipFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
  '@payloadcms/richtext-lexical/client#LinkFeatureClient':
    LinkFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
  '@payloadcms/richtext-lexical/client#ChecklistFeatureClient':
    ChecklistFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
  '@payloadcms/richtext-lexical/client#OrderedListFeatureClient':
    OrderedListFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
  '@payloadcms/richtext-lexical/client#UnorderedListFeatureClient':
    UnorderedListFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
  '@payloadcms/richtext-lexical/client#IndentFeatureClient':
    IndentFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
  '@payloadcms/richtext-lexical/client#AlignFeatureClient':
    AlignFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
  '@payloadcms/richtext-lexical/client#HeadingFeatureClient':
    HeadingFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
  '@payloadcms/richtext-lexical/client#ParagraphFeatureClient':
    ParagraphFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
  '@payloadcms/richtext-lexical/client#InlineCodeFeatureClient':
    InlineCodeFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
  '@payloadcms/richtext-lexical/client#SuperscriptFeatureClient':
    SuperscriptFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
  '@payloadcms/richtext-lexical/client#SubscriptFeatureClient':
    SubscriptFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
  '@payloadcms/richtext-lexical/client#StrikethroughFeatureClient':
    StrikethroughFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
  '@payloadcms/richtext-lexical/client#UnderlineFeatureClient':
    UnderlineFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
  '@payloadcms/richtext-lexical/client#BoldFeatureClient':
    BoldFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
  '@payloadcms/richtext-lexical/client#ItalicFeatureClient':
    ItalicFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
  '@payloadcms/storage-s3/client#S3ClientUploadHandler':
    S3ClientUploadHandler_f97aa6c64367fa259c5bc0567239ef24,
  '@payloadcms/ui/rsc#CollectionCards':
    CollectionCards_ab83ff7e88da8d3530831f296ec4756a
}
