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
import { BookPublishButton as BookPublishButton_c551497f9187e6fedc90a65363a008c6 } from 'src/payload/components/actions/books/publish-button.tsx'
import { ClaimApproveButton as ClaimApproveButton_02fc837e4f834eb3612d5992a01b0c80 } from 'src/payload/components/actions/claims/approve-button.tsx'
import { ClaimApproveCell as ClaimApproveCell_1baf74ccb8fa6efd4f88cf8ed4190e2c } from 'src/payload/components/actions/claims/approve-cell.tsx'
import { ClaimCancelButton as ClaimCancelButton_96488c7a949a0114eefff57a2d558f9c } from 'src/payload/components/actions/claims/cancel-button.tsx'
import { ProfileFeatureButton as ProfileFeatureButton_592194e75fb7dc63f966eada686d5a05 } from 'src/payload/components/actions/profiles/feature-button.tsx'
import { UserApproveButton as UserApproveButton_89753ea063ebc5a9beb5184b2b75d0bf } from 'src/payload/components/actions/users/approve-button.tsx'
import {
  ClaimStatusCell as ClaimStatusCell_fc67a8149c7740e8ab61a3dfe58d2655,
  ClaimStatusField as ClaimStatusField_fc67a8149c7740e8ab61a3dfe58d2655
} from 'src/payload/components/claims/status.tsx'
import { default as default_d0c4937741f3409f53e663e045013704 } from 'src/payload/components/fields/array-row-label.tsx'
import { ColorPickerField as ColorPickerField_6ba8973719d5d8d53be77fbc1fccc74e } from 'src/payload/components/fields/color-picker.tsx'
import { default as default_90441ee41512d23c76c47f07c342aebe } from 'src/payload/components/fields/string-array-cell.tsx'
import { LocationPicker as LocationPicker_93ac9f2330a13c266b57068fdb40f96f } from 'src/payload/components/locations/picker.tsx'

export const importMap = {
  'src/payload/components/fields/string-array-cell.tsx#default':
    default_90441ee41512d23c76c47f07c342aebe,
  'src/payload/components/fields/color-picker.tsx#ColorPickerField':
    ColorPickerField_6ba8973719d5d8d53be77fbc1fccc74e,
  'src/payload/components/fields/array-row-label.tsx#default':
    default_d0c4937741f3409f53e663e045013704,
  'src/payload/components/actions/books/publish-button.tsx#BookPublishButton':
    BookPublishButton_c551497f9187e6fedc90a65363a008c6,
  'src/payload/components/actions/claims/approve-cell.tsx#ClaimApproveCell':
    ClaimApproveCell_1baf74ccb8fa6efd4f88cf8ed4190e2c,
  'src/payload/components/claims/status.tsx#ClaimStatusCell':
    ClaimStatusCell_fc67a8149c7740e8ab61a3dfe58d2655,
  'src/payload/components/claims/status.tsx#ClaimStatusField':
    ClaimStatusField_fc67a8149c7740e8ab61a3dfe58d2655,
  'src/payload/components/actions/claims/cancel-button.tsx#ClaimCancelButton':
    ClaimCancelButton_96488c7a949a0114eefff57a2d558f9c,
  'src/payload/components/actions/claims/approve-button.tsx#ClaimApproveButton':
    ClaimApproveButton_02fc837e4f834eb3612d5992a01b0c80,
  'src/payload/components/locations/picker.tsx#LocationPicker':
    LocationPicker_93ac9f2330a13c266b57068fdb40f96f,
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
  'src/payload/components/actions/profiles/feature-button.tsx#ProfileFeatureButton':
    ProfileFeatureButton_592194e75fb7dc63f966eada686d5a05,
  'src/payload/components/actions/users/approve-button.tsx#UserApproveButton':
    UserApproveButton_89753ea063ebc5a9beb5184b2b75d0bf,
  '@payloadcms/storage-s3/client#S3ClientUploadHandler':
    S3ClientUploadHandler_f97aa6c64367fa259c5bc0567239ef24,
  '@payloadcms/ui/rsc#CollectionCards':
    CollectionCards_ab83ff7e88da8d3530831f296ec4756a
}
