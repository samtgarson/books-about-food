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
import { BookPublishButton as BookPublishButton_c211647b9773ce67b01490e92a97a231 } from 'src/payload/collections/books/components/publish-button.tsx'
import { ClaimApproveButton as ClaimApproveButton_19ade6f4e104dee3d0fd087c92004c97 } from 'src/payload/collections/claims/components/approve-button.tsx'
import { ClaimApproveCell as ClaimApproveCell_94b30a3e0da09dbd9eae749b04734401 } from 'src/payload/collections/claims/components/approve-cell.tsx'
import { ClaimCancelButton as ClaimCancelButton_78e8aff91ecaca334d993ade574cdbe4 } from 'src/payload/collections/claims/components/cancel-button.tsx'
import {
  ClaimStatusCell as ClaimStatusCell_21d2f7062d1fe0062ea64c44f8d3c0c4,
  ClaimStatusField as ClaimStatusField_21d2f7062d1fe0062ea64c44f8d3c0c4
} from 'src/payload/collections/claims/components/status.tsx'
import { LocationPicker as LocationPicker_b815847c38c8122cb3b5e41e02f031b2 } from 'src/payload/collections/locations/components/picker.tsx'
import { ProfileFeatureButton as ProfileFeatureButton_2d1432831a4612dc81865021c6b3cbad } from 'src/payload/collections/profiles/components/feature-button.tsx'
import { UserApproveButton as UserApproveButton_8139da074bcc9123dc98f7c747378aef } from 'src/payload/collections/users/components/approve-button.tsx'
import { ColorPickerField as ColorPickerField_769bfdd285767568b612dcc4334e8b2f } from 'src/payload/components/fields/color-picker/index.tsx'
import { ArrayRowLabel as ArrayRowLabel_1a7e8d7c06d750553aaed5d2957fb002 } from 'src/payload/components/ui/array-row-label.tsx'

export const importMap = {
  'src/payload/components/fields/color-picker/index.tsx#ColorPickerField':
    ColorPickerField_769bfdd285767568b612dcc4334e8b2f,
  'src/payload/components/ui/array-row-label.tsx#ArrayRowLabel':
    ArrayRowLabel_1a7e8d7c06d750553aaed5d2957fb002,
  'src/payload/collections/books/components/publish-button.tsx#BookPublishButton':
    BookPublishButton_c211647b9773ce67b01490e92a97a231,
  'src/payload/collections/claims/components/approve-cell.tsx#ClaimApproveCell':
    ClaimApproveCell_94b30a3e0da09dbd9eae749b04734401,
  'src/payload/collections/claims/components/status.tsx#ClaimStatusCell':
    ClaimStatusCell_21d2f7062d1fe0062ea64c44f8d3c0c4,
  'src/payload/collections/claims/components/status.tsx#ClaimStatusField':
    ClaimStatusField_21d2f7062d1fe0062ea64c44f8d3c0c4,
  'src/payload/collections/claims/components/cancel-button.tsx#ClaimCancelButton':
    ClaimCancelButton_78e8aff91ecaca334d993ade574cdbe4,
  'src/payload/collections/claims/components/approve-button.tsx#ClaimApproveButton':
    ClaimApproveButton_19ade6f4e104dee3d0fd087c92004c97,
  'src/payload/collections/locations/components/picker.tsx#LocationPicker':
    LocationPicker_b815847c38c8122cb3b5e41e02f031b2,
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
  'src/payload/collections/profiles/components/feature-button.tsx#ProfileFeatureButton':
    ProfileFeatureButton_2d1432831a4612dc81865021c6b3cbad,
  'src/payload/collections/users/components/approve-button.tsx#UserApproveButton':
    UserApproveButton_8139da074bcc9123dc98f7c747378aef,
  '@payloadcms/storage-s3/client#S3ClientUploadHandler':
    S3ClientUploadHandler_f97aa6c64367fa259c5bc0567239ef24,
  '@payloadcms/ui/rsc#CollectionCards':
    CollectionCards_ab83ff7e88da8d3530831f296ec4756a
}
