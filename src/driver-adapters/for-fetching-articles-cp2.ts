import { Article } from '../article';
import { ForFetchingArticles } from '../tts-generator';
import axios from 'axios';

export class ForFetchingArticlesCp2 implements ForFetchingArticles {
  constructor(private cp2Url: string, private username: string, private password: string) {}

  async fetchArticle(url: string): Promise<Article> {
    // Make content request
    const contentResponse = await axios.post(
      this.cp2Url,
      {
        query:
          'fragment AnnotationFrag on Annotation{type index length}fragment ComponentFrag on ArticleComponent{type ... on ParagraphComponent{text annotations{...AnnotationFrag}}... on BlockQuoteComponent{text annotations{...AnnotationFrag}}... on CrossheadComponent{text}... on OrderedListComponent{items{text annotations{...AnnotationFrag}}}... on UnorderedListComponent{items{text annotations{...AnnotationFrag}}}... on BookInfoComponent{text annotations{...AnnotationFrag}}}query GetArticle($url:String!){findArticleByUrl(url:$url){headline flyTitle rubric dateFirstPublished section{name}body{...ComponentFrag ... on InfoboxComponent{type components{...ComponentFrag}}}}}',
        variables: {
          url,
        },
      },
      {
        auth: {
          username: this.username,
          password: this.password,
        },
      },
    );

    // Convert response
    return Article.parse(contentResponse.data.data.findArticleByUrl);
  }
}
