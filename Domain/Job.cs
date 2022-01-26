using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.IO;
using System.Xml.Serialization;
using System.Xml;
using System.Runtime.Serialization.Formatters.Binary;

namespace Domain
{

    [Serializable]
    public class Job
    {
        public Guid Id {get;set;}

        public string Title {get ;set;}

        public DateTime Date {get ; set;}

        public DateTime UpdateOn {get ; set;}

        public string Description {get ; set;}

    }

      public class GroupOfList
    {
        [XmlElement("Job")]
        public List<Job> JobList = new List<Job>();

    }



}