type ProjectCopy = {
  title?: string | null;
  description?: string | null;
};

export const cleanProjectCopy = <T extends ProjectCopy>(project: T): T => {
  const title =
    project.title === 'Receipt Parcer'
      ? 'Receipt Parser'
      : project.title === 'Vibe Code Creations'
        ? 'Small Utility Apps'
        : project.title;
  const rawDescription = project.description?.trim();
  const description = (() => {
    if (project.title === 'ham-san.net') {
      return 'Third version of my homepage, built while trying a newer frontend stack.';
    }
    if (project.title === 'Vibe Code Creations') {
      return 'A set of small utility apps, including Pixelator, a darts counter, and print prep tools.';
    }
    if (project.title === 'Link! Like! LoveLive! Chart Viewer') {
      return 'Viewer for song charts from Link! Like! Love Live!.';
    }
    if (project.title === 'LoveLive! Sorter') {
      return 'Sorter for favorite seiyuu and characters.';
    }
    if (project.title === 'ぼっちラブカシミュレーター (Bocchi Loveca Simulator)') {
      return 'Solo Loveca simulator with tuned score variance and readable challenge settings.';
    }
    if (project.title === 'Receipt Parcer' && rawDescription === 'Parse receipt screenshots into') {
      return 'Parse receipt screenshots into structured expense data.';
    }
    if (project.title === 'Kingblade x10iii tuning tool') {
      return 'Tooling for configuring Kingblade x10iii on modern devices with practical IR and QR workflows.';
    }
    if (project.title === 'Seiyuu Shirt Generator') {
      return 'Shirt asset generator for seiyuu-themed templates, replacing manual PSD work with print-ready PNG output.';
    }
    if (project.title === 'Oshi Cropper (仮)') {
      return 'Cropper for preparing can badge files.';
    }
    if (project.title === 'Ijigen Day N') {
      return 'Small event day counter with timezone-safe day boundaries and light maintenance.';
    }
    if (
      project.title === 'Homepage V4' &&
      rawDescription === 'Brand new homepage (again) !\nComing soon...'
    ) {
      return 'Homepage redesign, currently in planning.';
    }
    if (project.title === 'Kanji Phonetics Component Explorer') {
      return 'Tool for studying kanji phonetic components.';
    }
    if (project.title === 'Japanese Sentence Alignment Visualizer') {
      return 'Tool for viewing sentence alignment.';
    }
    return project.description;
  })();

  return { ...project, title, description };
};
