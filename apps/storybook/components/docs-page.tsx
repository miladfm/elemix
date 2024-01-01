import * as React from 'react';
import { useState } from 'react';
import { DocsContext, Markdown, Stories, Subtitle } from '@storybook/addon-docs';
import './doc-page.css';
import { DocPageTab } from './doc-page-tab';
import compoDocJson from '../tmp/documentation.json';
import { CompoDocInterface, DocsConfig, StorybookParameters } from './doc-page.model';
import { createMarkup, renderDefaultValue, renderMethodValue } from './doc-page.util';


export const DocPage = (_arg: unknown) => {

  const context = React.useContext(DocsContext);
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  const compoDoc = compoDocJson.interfaces as CompoDocInterface[];
  const parameters = context.storyById().parameters as StorybookParameters;
  const docs: DocsConfig = parameters.docs;
  const pageInterfaces = compoDoc.filter((property) => property.file.endsWith(docs.apiRefPath));

  // DEBUG
  // debugger;
  // console.log('context', context);
  // console.log('arg', arg);
  // console.log('context.storyById().parameters', context.storyById().parameters);
  // console.log('context.storyById().parameters.docs', context.storyById().parameters.docs);
  // console.log('compoDoc', compoDoc);
  // console.log('argTypes', context.argTypes);
  // console.table(stories.map((s) => ({ id: s.id, kind: s.kind, name: s.name, story: s.story })));
  // console.table(
  //   Object.values((context as any).argTypes).map(arg => ({
  //     name: arg.name,
  //     description: arg.description,
  //     type: arg.table?.type?.summary ?? '?',
  //     default: arg.table?.defaultValue?.summary ?? '-',
  //   })),
  // );


  return (
    <div className="doc__wrapper">
      <div className="doc__header">
        <h1>@elemix/{context.storyById().title.toLowerCase()}</h1>
        <Subtitle />
      </div>
      <div className="doc__tabs">
        <DocPageTab onTabChange={(index) => setSelectedTabIndex(index)}></DocPageTab>
        {selectedTabIndex === 0 && (
          <>
            <Markdown>{docs.overviewMarkdown}</Markdown>
            <img className="doc__tabs-bg" src="images/doc-bg.svg" />
          </>
        )}
        {selectedTabIndex === 1 && (
          <>
            <div>
              {pageInterfaces.map((item) => (
                <div className="doc__table-wrapper" key={item.id}>
                  <h3>{item.name}</h3>
                  <div dangerouslySetInnerHTML={createMarkup(item.description)}></div>

                  {item.properties.length > 0 && (
                    <>
                      <h4 className="doc__table-header">Properties</h4>
                      <table className="doc__table">
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Type</th>
                            <th>Description</th>
                            <th>Default Value</th>
                          </tr>
                        </thead>
                        <tbody>
                          {item.properties.map((prop) => (
                            <tr key={prop.name}>
                              <td>{prop.name}</td>
                              <td className="doc__table--center">{prop.type}</td>
                              <td dangerouslySetInnerHTML={createMarkup(prop.description)} />
                              <td className="doc__table--center" dangerouslySetInnerHTML={createMarkup(renderDefaultValue(prop))} />
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </>
                  )}

                  {item.methods.length > 0 && (
                    <>
                      <h4 className="doc__table-header">Methods</h4>
                      <table className="doc__table">
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Type</th>
                            <th>Description</th>
                          </tr>
                        </thead>
                        <tbody>
                          {item.methods.map((prop) => (
                            <tr key={prop.name}>
                              <td>{prop.name}</td>
                              <td dangerouslySetInnerHTML={createMarkup(renderMethodValue(prop))} />
                              <td dangerouslySetInnerHTML={createMarkup(prop.description)} />
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
        {selectedTabIndex === 2 && (
          <div className="doc__example-wrapper">
            <Stories title="" />
          </div>
        )}
        ;
      </div>
    </div>
  );
};
