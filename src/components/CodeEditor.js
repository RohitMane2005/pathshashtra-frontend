import { useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import { EditorView, keymap, lineNumbers, highlightActiveLine, highlightActiveLineGutter, drawSelection, dropCursor, rectangularSelection, crosshairCursor } from "@codemirror/view";
import { EditorState, Compartment } from "@codemirror/state";
import { defaultKeymap, history, historyKeymap, indentWithTab } from "@codemirror/commands";
import { syntaxHighlighting, defaultHighlightStyle, bracketMatching, foldGutter, indentOnInput, StreamLanguage } from "@codemirror/language";
import { closeBrackets, autocompletion, closeBracketsKeymap, completionKeymap } from "@codemirror/autocomplete";
import { oneDark } from "@codemirror/theme-one-dark";
import { java } from "@codemirror/lang-java";
import { python } from "@codemirror/lang-python";
import { cpp } from "@codemirror/lang-cpp";
import { javascript } from "@codemirror/lang-javascript";

/* ── language snippets with boilerplate ── */
const BOILERPLATE = {
  Java: `import java.util.*;

public class Solution {
    public static void main(String[] args) {
        // Test your solution here
    }

    // Write your solution here
    
}`,
  Python: `from typing import List, Optional

class Solution:
    def solve(self):
        # Write your solution here
        pass

# Test
sol = Solution()`,
  "C++": `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    // Write your solution here
    
};

int main() {
    // Test your solution here
    return 0;
}`,
  JavaScript: `/**
 * @param {number[]} nums
 * @return {number}
 */
var solve = function(nums) {
    // Write your solution here
    
};`,
  C: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

// Write your solution here

int main() {
    // Test your solution here
    return 0;
}`,
  Kotlin: `fun main() {
    // Test your solution here
}

// Write your solution here
fun solve(): Unit {
    
}`,
};

/* ── get CodeMirror language extension ── */
function getLang(language) {
  switch (language) {
    case "Java":       return java();
    case "Python":     return python();
    case "C++":        return cpp();
    case "JavaScript": return javascript({ jsx: false });
    case "C":          return cpp(); // C uses cpp parser
    case "Kotlin":     return javascript(); // fallback
    default:           return javascript();
  }
}

/* ── custom theme matching PathShashtra dark style ── */
const pathTheme = EditorView.theme({
  "&": {
    height: "100%",
    fontSize: "13px",
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', Consolas, monospace",
    backgroundColor: "#1e1e2e",
  },
  ".cm-scroller": {
    overflow: "auto",
    fontFamily: "inherit",
    lineHeight: "1.7",
  },
  ".cm-content": {
    padding: "14px 0",
    caretColor: "#c0caf5",
  },
  ".cm-line": {
    padding: "0 16px",
  },
  ".cm-cursor": {
    borderLeftColor: "#c0caf5",
    borderLeftWidth: "2px",
  },
  ".cm-activeLine": {
    backgroundColor: "rgba(255,255,255,0.04)",
  },
  ".cm-activeLineGutter": {
    backgroundColor: "rgba(255,255,255,0.04)",
  },
  ".cm-gutters": {
    backgroundColor: "#1a1a2e",
    borderRight: "1px solid rgba(255,255,255,0.07)",
    color: "#3d3b52",
    minWidth: "48px",
  },
  ".cm-lineNumbers .cm-gutterElement": {
    padding: "0 12px 0 8px",
    minWidth: "40px",
  },
  ".cm-foldGutter": {
    width: "16px",
  },
  ".cm-selectionBackground, ::selection": {
    backgroundColor: "rgba(155,109,255,0.25) !important",
  },
  ".cm-matchingBracket": {
    backgroundColor: "rgba(155,109,255,0.3)",
    outline: "1px solid rgba(155,109,255,0.6)",
    borderRadius: "2px",
  },
  ".cm-tooltip": {
    backgroundColor: "#1e1e2e",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "8px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
  },
  ".cm-tooltip-autocomplete": {
    "& > ul > li": {
      padding: "4px 12px",
      fontSize: "12px",
      fontFamily: "inherit",
    },
    "& > ul > li[aria-selected]": {
      backgroundColor: "rgba(155,109,255,0.25)",
      color: "#c0caf5",
    },
  },
  ".cm-placeholder": {
    color: "#3d3b52",
  },
}, { dark: true });

/* ─────────────────────────────────────────────
   CodeEditor component
   Props:
     value       string   — controlled code value
     onChange    fn       — called with new string
     language    string   — "Java"|"Python"|"C++"|"JavaScript"|"C"|"Kotlin"
     disabled    bool     — read-only when true
     onSubmit    fn       — called on Ctrl+Enter
     placeholder string  — placeholder text
───────────────────────────────────────────── */
const CodeEditor = forwardRef(function CodeEditor(
  { value, onChange, language, disabled, onSubmit, placeholder },
  ref
) {
  const containerRef = useRef(null);
  const viewRef      = useRef(null);
  const langComp     = useRef(new Compartment());
  const editComp     = useRef(new Compartment());
  const onChangeRef  = useRef(onChange);
  const onSubmitRef  = useRef(onSubmit);

  // keep refs current without remounting
  useEffect(() => { onChangeRef.current = onChange; }, [onChange]);
  useEffect(() => { onSubmitRef.current = onSubmit; }, [onSubmit]);

  /* expose getValue() to parent */
  useImperativeHandle(ref, () => ({
    getValue: () => viewRef.current?.state.doc.toString() ?? "",
    focus: () => viewRef.current?.focus(),
  }));

  /* mount editor once */
  useEffect(() => {
    if (!containerRef.current) return;

    const startState = EditorState.create({
      doc: value || BOILERPLATE[language] || "",
      extensions: [
        /* look */
        pathTheme,
        oneDark,
        syntaxHighlighting(defaultHighlightStyle, { fallback: true }),

        /* gutter */
        lineNumbers(),
        highlightActiveLineGutter(),
        foldGutter(),

        /* editing quality */
        history(),
        drawSelection(),
        dropCursor(),
        rectangularSelection(),
        crosshairCursor(),
        highlightActiveLine(),
        bracketMatching(),
        closeBrackets(),
        indentOnInput(),
        autocompletion(),

        /* keymaps */
        keymap.of([
          ...closeBracketsKeymap,
          ...defaultKeymap,
          ...historyKeymap,
          ...completionKeymap,
          indentWithTab,
          {
            key: "Ctrl-Enter",
            mac: "Cmd-Enter",
            run: () => { onSubmitRef.current?.(); return true; },
          },
        ]),

        /* language (swappable via compartment) */
        langComp.current.of(getLang(language)),

        /* editable (swappable) */
        editComp.current.of(EditorState.readOnly.of(!!disabled)),

        /* onChange listener */
        EditorView.updateListener.of(update => {
          if (update.docChanged) {
            onChangeRef.current?.(update.state.doc.toString());
          }
        }),

        /* placeholder */
        EditorView.contentAttributes.of({ "data-gramm": "false" }),
      ],
    });

    const view = new EditorView({ state: startState, parent: containerRef.current });
    viewRef.current = view;

    return () => { view.destroy(); viewRef.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // mount once only

  /* swap language when it changes */
  useEffect(() => {
    if (!viewRef.current) return;
    viewRef.current.dispatch({
      effects: langComp.current.reconfigure(getLang(language)),
    });
  }, [language]);

  /* swap editable when disabled changes */
  useEffect(() => {
    if (!viewRef.current) return;
    viewRef.current.dispatch({
      effects: editComp.current.reconfigure(EditorState.readOnly.of(!!disabled)),
    });
  }, [disabled]);

  /* sync value from outside (e.g. reset / retry) — only when it truly differs */
  useEffect(() => {
    if (!viewRef.current) return;
    const current = viewRef.current.state.doc.toString();
    if (current !== value) {
      viewRef.current.dispatch({
        changes: { from: 0, to: current.length, insert: value ?? "" },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <div
      ref={containerRef}
      style={{ height:"100%", overflow:"hidden", background:"#1e1e2e" }}
    />
  );
});

export default CodeEditor;
export { BOILERPLATE };
